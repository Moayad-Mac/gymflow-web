"use client";
import useApiFetch from "@/app/lib/apiFetch";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function Bookings() {
  const apiFetch = useApiFetch();
  const today = new Date();
  const { mutate } = useSWRConfig();
  const [deleteError, setDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const { data, error, isLoading } = useSWR("/bookings", fetcher);
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  async function handleDel(id) {
    const deleting = await apiFetch(`/bookings/${id}`, "DELETE");
    if (!deleting.success) {
      setDeleteError(id);
      setDeleteErrorMessage(deleting.message);
    }

    if (deleting.success) {
      mutate("/bookings");
    }
  }

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error occured, pls try again later</div>;

  return (
    <div className="text-center">
      {data.length === 0 && (
        <p className="m-auto w-fit text-center font-light text-xl md:text-2xl lg:text-2xl">
          you still have no upcoming bookings
        </p>
      )}
      {data.length > 0 && (
        <div>
          <h1 className="text-xl mb-5 font-light">your bookings:</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {data.map((book) => {
              const bookDate = new Date(book.class_date);
              return (
                <div
                  key={book.id}
                  className="bg-gray-100 rounded-xl p-5 shadow-lg mb-5 hover:scale-110 duration-200"
                >
                  <h1 className="text-lg font-bold mb-3 text-cyan-600">
                    {book.gym_class.name}
                  </h1>
                  <p>date: {book.class_date.substr(0, 10)}</p>
                  <p className="my-2">
                    day of week: {days[book.gym_class.day_of_week]}
                  </p>
                  <p>starts at: {book.gym_class.starts_at}</p>
                  <p className="my-2">duration: {book.gym_class.duration}</p>
                  <p>
                    status:{" "}
                    <span
                      className={`${
                        bookDate > today && book.status == "confirmed"
                          ? "text-green-400"
                          : book.status == "cancelled"
                            ? "text-red-500"
                            : "text-black/50"
                      }`}
                    >
                      {book.status}
                    </span>
                  </p>
                  {bookDate > today && book.status == "confirmed" && (
                    <button
                      className="cursor-pointer bg-red-500 text-white p-2 rounded-lg mt-4 font-semibold"
                      onClick={() => {
                        handleDel(book.id);
                      }}
                    >
                      cancel booking
                    </button>
                  )}
                  {deleteError === book.id && (
                    <p className="text-red-500 text-sm">{deleteErrorMessage}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
