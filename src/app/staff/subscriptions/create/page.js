"use client";
import useApiFetch from "@/app/lib/apiFetch";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function CreateSubscription() {
  const { data, error, isLoading } = useSWR("/members-and-plans", fetcher);
  const apiFetch = useApiFetch();
  const [plan, setPlan] = useState("");
  const [memberId, setMemberId] = useState("");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  async function create(e) {
    e.preventDefault();
    setCreating(true);
    setErrors({});
    setGlobalError("");
    setSuccess(false);

    const created = await apiFetch("/subscriptions", "POST", {
      member_id: memberId,
      membership_plan_id: plan,
    });

    if (created.success) {
      setSuccess(true);
    }

    if (!created.success) {
      if (created.errors) {
        setErrors(created.errors);
      } else {
        setGlobalError(created.message);
      }
    }

    setCreating(false);
  }

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error, pls try again later</div>;

  const filteredMembers = data.members.filter(
    (member) =>
      String(member.id) === memberId ||
      member.user.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="text-center w-3xs md:w-md lg:w-2xl m-auto h-1/2 p-6 bg-gray-100 rounded-2xl shadow-2xl">
      <form onSubmit={create}>
        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="">choose plan</option>
          {data.membership_plans.map((plan) => (
            <option value={plan.id} key={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
        {errors?.membership_plan_id && (
          <p className="text-red-500 text-sm mt-5">
            please choose a valid membership plan
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 my-5 lg:my-10 mb-10 justify-around">
          <div className="relative my-5">
            <input
              type="text"
              placeholder=" "
              id="search"
              value={search}
              className="peer md:w-sm lg:w-50 block border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              onChange={(e) => setSearch(e.target.value)}
            />
            <label
              htmlFor="search"
              className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
            >
              search by email
            </label>
          </div>

          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="">select a member</option>
            {filteredMembers.map((member) => (
              <option value={member.id} key={member.id}>
                {member.user.email}
              </option>
            ))}
          </select>
          {errors?.member_id && (
            <p className="text-red-500 text-sm mt-5 lg:mt-0">
              please choose a valid member
            </p>
          )}
        </div>

        <div className="my-5">
          {!creating && (
            <button className="p-2 px-3 bg-blue-500 rounded-md cursor-pointer text-bold text-white">
              create subscription
            </button>
          )}
          {creating && (
            <button
              className="p-2 px-3 bg-blue-200 rounded-md cursor-not-allowed text-bold text-white"
              disabled
            >
              creating...
            </button>
          )}
        </div>
        {globalError && <p className="text-red-500 text-sm">{globalError}</p>}
        {success && (
          <p className="text-green-500 text-sm">created successfully</p>
        )}
      </form>
    </div>
  );
}
