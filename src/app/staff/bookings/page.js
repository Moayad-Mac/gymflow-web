"use client";
import React from "react";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function Bookings() {
  const { data, error, isLoading } = useSWR("/bookings", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error, pls try again later</div>;
  return (
    <div className="text-center">
      <h1 className="text-xl font-light">bookings: </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 my-8 justify-items-center">
        {data.map((book) => (
          <div
            key={book.id}
            className="my-2 bg-gray-100 rounded-xl hover:scale-110 duration-200 w-xs py-4"
          >
            <h1 className="text-lg font-extralight">id: {book.id}</h1>
            <p className="my-2">
              member name:{" "}
              <span className="text-emerald-600">{book.member.user.name}</span>
            </p>
            <p>
              class:{" "}
              <span className="text-emerald-600">{book.gym_class.name}</span>
            </p>
            <p className="my-2">class date: {book.class_date.substr(0, 10)}</p>
            <p>
              status:{" "}
              <span
                className={`${book.status === "confirmed" ? "text-green-500" : book.status === "completed" ? "text-gray-500" : "text-red-400"}`}
              >
                {book.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
