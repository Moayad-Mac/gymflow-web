"use client";
import React from "react";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function MemberPage() {
  const { data, error, isLoading } = useSWR("/subscriptions", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>an error occured, please try again later.</div>;

  if (data.response.length === 0) {
    return (
      <div className="text-center">
        <h1 className="font-blod text-2xl m-5 font-light lg:mb-10 lg:mt-10">
          available subscriptions:
        </h1>
        <div className="grid grid-cols-1 gap-5 md:gap-20 lg:grid-cols-3 lg:gap-0 my-10">
          <div className="bg-gray-50 shadow-lg w-xs p-4 rounded-xl m-auto hover:scale-110 duration-200">
            <h1 className="m-3 lg:m-4 text-xl text-cyan-700">plan: monthly</h1>
            <p>price: 30</p>
            <p className="m-3 lg:m-4">30 days</p>
            <p className="text-emerald-700">
              Full access to all gyms, billed monthly.
            </p>
          </div>
          <div className="bg-gray-50 shadow-lg w-xs p-4 rounded-xl m-auto hover:scale-110 duration-200">
            <h1 className="m-3 lg:m-4 text-xl text-cyan-700">
              plan: Quarterly
            </h1>
            <p>price: 80</p>
            <p className="m-3 lg:m-4">90 days</p>
            <p className="text-emerald-700">
              Full access to all gyms, billed every 3 months. Save compared to
              monthly.
            </p>
          </div>
          <div className="bg-gray-50 shadow-lg w-xs p-4 rounded-xl m-auto hover:scale-110 duration-200">
            <h1 className="m-3 lg:m-4 text-xl text-cyan-700">plan: Annual</h1>
            <p>price: 285</p>
            <p className="m-3 lg:m-4">365 days</p>
            <p className="text-emerald-700">
              Full access to all gyms, billed yearly. Best value.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-light mb-8">your subscriptions: </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 justify-items-center gap-6">
        {data.response.map((sub) => (
          <div
            key={sub.subscription_id}
            className="bg-gray-100 rounded-lg shadow-xl p-5 hover:scale-110 duration-200"
          >
            <p className="text-lg">
              status:{" "}
              <span
                className={`${sub.subscription_status === "active" ? "text-green-500" : sub.subscription_status === "cancelled" ? "text-red-500" : "text-gray-500"}`}
              >
                {sub.subscription_status}
              </span>
            </p>
            <p className="text-lg my-3">plan: {sub.membership_plan}</p>
            <p className="text-lg">
              plan expires at: {sub.membership_expires_at.trim().substr(0, 10)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
