"use client";
import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

function readAuth() {
  const token = localStorage.getItem("token");
  const roleData = localStorage.getItem("userRole");
  const role = roleData ? JSON.parse(roleData).role : null;
  return { token, role };
}

function getSnapshot() {
  const { token, role } = readAuth();
  return Boolean(token && role && role !== "member" && role !== "staff");
}

function getServerSnapshot() {
  return false;
}

function subscribe() {
  return () => {};
}

export default function MemberLayout({ children }) {
  const router = useRouter();
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
    if (role === "staff") {
      router.push("/staff");
      return;
    }
  }, [router]);

  if (!safe) {
    return <div>loading...</div>;
  }

  return <div>{children}</div>;
}
