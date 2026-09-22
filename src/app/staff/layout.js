"use client";
import React, { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

function readAuth() {
  const token = localStorage.getItem("token");
  const roleData = localStorage.getItem("userRole");
  const role = roleData ? JSON.parse(roleData).role : null;
  return { token, role };
}

function getSnapshot() {
  const { token, role } = readAuth();
  return Boolean(token && role && role !== "member" && role !== "trainer");
}

function getServerSnapshot() {
  return false;
}

function subscribe() {
  return () => {};
}

export default function MemberLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const safe = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const { token, role } = readAuth();

    if (!token || !role) {
      router.push("/login");
      return;
    }
    if (role === "member") {
      router.push("/member");
      return;
    }
    if (role === "trainer") {
      router.push("/trainer");
      return;
    }
  }, [router]);

  if (!safe) {
    return <div>loading...</div>;
  }

  const paths = [
    { name: "Bookings", href: "/staff/bookings" },
    { name: "Check-in", href: "/staff/check-in" },
    { name: "Classes", href: "/staff/classes" },
    { name: "Subscriptions", href: "/staff/subscriptions" },
  ];

  return (
    <div>
      <nav className="text-sm md:text-xl w-full grid grid-cols-4 md:gap-10 text-center p-5 bg-gray-50 shadow-md rounded-2xl mb-10 ">
        {paths.map((path) => {
          const isActive = pathname === path.href;

          return (
            <Link
              href={path.href}
              key={path.href}
              className={`${isActive ? "text-blue-500" : "text-black"}`}
            >
              {path.name}
            </Link>
          );
        })}
      </nav>
      <div>{children}</div>
    </div>
  );
}
