"use client";
import useApiFetch from "@/app/lib/apiFetch";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) => fetch(API_URL + url).then((r) => r.json());

export default function Register() {
  const router = useRouter();
  const apiFetch = useApiFetch();
  const [isPending, setIsPending] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const [gymId, setGymId] = useState("");

  const { data, error, isLoading } = useSWR("/gyms", fetcher);
  async function register(e) {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setIsPending(true);
    const data = await apiFetch("/register", "POST", {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      gym_id: parseInt(gymId),
    });

    if (!data.success) {
      if (data.errors) {
        setErrors(data.errors);
      } else if (data.message) {
        setGlobalError(data.message);
      } else {
        setGlobalError("couldn't register, please try again later");
      }
    }

    if (data.success) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("userRole", JSON.stringify(data.data.userRole));

      if (data.data.userRole.role == "staff") {
        router.push("/staff/classes");
      } else if (data.data.userRole.role == "trainer") {
        router.push("/trainer");
      } else {
        router.push("/member");
      }
    }

    setIsPending(false);
  }

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error, pls try again later</div>;

  return (
    <div className="h-1/2 m-auto p-5 md:p-10 lg:p-5 bg-gray-100 w-3xs md:w-lg text-center rounded-3xl shadow-2xl">
      <p className="mb-10 text-center font-bold tracking-tight text-2xl">
        Register | Create an account
      </p>
      <form onSubmit={register}>
        {globalError && (
          <div className="text-red-500 text-sm my-8">{globalError}</div>
        )}

        <div className="relative my-5">
          <input
            placeholder=" "
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="peer block w-full border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="name"
            className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            name
          </label>
          {errors.name && (
            <div className="text-red-500 text-sm mt-2">{errors.name}</div>
          )}
        </div>

        <div className="relative my-5">
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
            <div className="text-red-500 text-sm mt-2">{errors.email}</div>
          )}
        </div>

        <div className="relative my-5">
          <input
            placeholder=" "
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer block w-full border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="password"
            className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            password
          </label>
          {errors.password && (
            <div className="text-red-500 text-sm mt-2">{errors.password}</div>
          )}
        </div>

        <div className="relative my-5">
          <input
            placeholder=" "
            type="password"
            id="password-confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="peer block w-full border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="password-confirmation"
            className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            password confirmation
          </label>
          {errors.password_confirmation && (
            <div className="text-red-500 text-sm mt-2">
              {errors.password_confirmation}
            </div>
          )}
        </div>

        <div className="mb-5">
          <select
            name="gym_id"
            value={gymId}
            onChange={(e) => setGymId(e.target.value)}
            className="mb-2 w-fit rounded-xl"
          >
            <option value="" disabled>
              select gym
            </option>
            {data.map((gym) => (
              <option value={gym.id} key={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>
          {errors.gym_id && (
            <p className="text-red-500 text-sm">please choose a valid gym</p>
          )}
        </div>

        {!isPending && (
          <button className="cursor-pointer bg-blue-600 p-2 px-4 rounded-xl text-lg font-bold text-white">
            register
          </button>
        )}
        {isPending && (
          <button
            disabled
            className="cursor-pointer bg-blue-300  p-2 px-4 rounded-xl text-lg font-bold text-white"
          >
            registering...
          </button>
        )}
      </form>
      <p className="text-xs mt-8 text-center">
        already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          login
        </Link>
      </p>
    </div>
  );
}
