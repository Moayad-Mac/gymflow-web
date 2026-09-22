"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useApiFetch from "@/app/lib/apiFetch";

export default function Login() {
  const router = useRouter();
  const apiFetch = useApiFetch();
  const [isPending, setIsPending] = useState(false);
  const [golbalError, setGlobalError] = useState("");
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setIsPending(true);
    const data = await apiFetch("/login", "POST", {
      email: email,
      password: password,
    });

    if (!data.success) {
      if (data.errors) {
        setErrors(data.errors);
      } else if (data.message) {
        setGlobalError(data.message);
      } else {
        setGlobalError("couldn't log in, please try again later");
      }
    }

    if (data.success) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("userRole", JSON.stringify(data.data.userRole));

      console.log(data.data.userRole);

      if (data.data.userRole.role == "staff") {
        router.push("/staff/classes");
      } else if (data.data.userRole.role == "trainer") {
        router.push("/trainer");
      } else {
        router.push("/member");
      }
    }

    setIsPending(false);
  };

  return (
    <div className="w-3xs md:w-md m-auto h-1/2 p-6 bg-gray-100 rounded-2xl shadow-2xl">
      <p className="text-center font-bold my-2 mb-10 tracking-tight text-2xl">
        Login | welcome back
      </p>
      {golbalError && <div className="text-red-500 text-sm">{golbalError}</div>}
      <form onSubmit={login}>
        <div className="relative my-5 md:my-10">
          <input
            placeholder=" "
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer block w-full border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="email"
            className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            email
          </label>
          {errors.email && (
            <div className="text-sm text-red-500">{errors.email}</div>
          )}
        </div>

        <div className="relative my-5 md:my-10">
          <input
            type="password"
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            className="peer block w-full border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="password"
            className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            password
          </label>
          {errors.password && (
            <div className="text-sm text-red-500">{errors.password}</div>
          )}
        </div>
        {isPending && (
          <button
            disabled
            className="cursor-not-allowed bg-blue-300 mx-auto block mt-10 p-1 px-4 rounded-lg text-white text-lg"
          >
            loging in ...
          </button>
        )}
        {!isPending && (
          <button className="cursor-pointer bg-blue-600 mx-auto block mt-10 p-1 px-4 rounded-lg text-white text-lg">
            login
          </button>
        )}
      </form>
      <p className="text-xs mt-8 text-center">
        don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500">
          register
        </Link>
      </p>
    </div>
  );
}
