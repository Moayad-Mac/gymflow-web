"use client";
import React from "react";
import useSWR from "swr";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function StaffClasses() {
  const { data, error, isLoading } = useSWR("/gym-classes", fetcher);
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error, pls try again later</div>;
  if (data.data.length === 0) return <div>no classes yet</div>;
  return (
    <div className="text-center">
      <Link
        href="/staff/classes/create"
        className="bg-blue-400 rounded-full text-white mx-8 my-4 fixed right-0 bottom-0 h-10 w-10 text-center text-4xl"
      >
        +
      </Link>
      <h1 className="mb-6 text-xl font-light">Classes:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mb-5">
        {data.data.map((cls) => (
          <div
            key={cls.id}
            className="bg-gray-100 shadow-xl rounded-xl p-5 hover:scale-110 duration-200 my-2"
          >
            <h1 className="text-lg font-bold mb-3 text-cyan-600">
              {cls.class_name}
            </h1>
            <p>gym: {cls.gym}</p>
            <p className="my-1">capacity: {cls.capacity}</p>
            <p>duration: {cls.duration}</p>
            <p className="my-1">starts at: {cls.starts_at}</p>
            <p>
              trainer: <span className="text-emerald-600">{cls.trainer}</span>
            </p>
            <p className="mt-1">day of week: {days[cls.day_of_week]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
