"use client";
import React from "react";
import useSWR from "swr";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function Subscriptions() {
  const { data, error, isLoading } = useSWR("/subscriptions", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error, pls try again later</div>;
  if (data.response.length === 0)
    return (
      <div className="w-full my-10 text-xl text-center">
        no subscriptions yet
      </div>
    );
  return (
    <div className="text-center">
      <Link
        href="/staff/subscriptions/create"
        className="bg-blue-400 rounded-full text-white mx-8 my-4 fixed right-0 bottom-0 h-10 w-10 text-center text-4xl"
      >
        +
      </Link>
      <h1 className="mb-6 text-xl font-light">subscriptions:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mb-5">
        {data.response.map((sub) => (
          <div
            key={sub.subscription_id}
            className="bg-gray-100 rounded-xl shadow-xl p-5 hover:scale-110 duration-200 my-2"
          >
            <h1 className="text-lg font-bold mb-3 text-cyan-600">
              {sub.member}
            </h1>
            <p>plan: {sub.membership_plan}</p>
            <p>starts at: {sub.membership_starts_at.substr(0, 10)}</p>
            <p>expires at: {sub.membership_expires_at.substr(0, 10)}</p>
            <p>
              status:{" "}
              <span
                className={`${sub.subscription_status === "active" ? "text-green-500" : "text-red-400"}`}
              >
                {sub.subscription_status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
