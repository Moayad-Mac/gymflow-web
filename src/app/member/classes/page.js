"use client";
import useApiFetch from "@/app/lib/apiFetch";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function MemberClasses() {
  const apiFetch = useApiFetch();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [success, setSuccess] = useState("");
  const { data, error, isLoading } = useSWR("/gym-classes", fetcher);
  const {
    data: subscriptions,
    error: subscriptionsError,
    isLoading: subscriptionsLoading,
  } = useSWR("/subscriptions", fetcher);

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  function getUpcomingDate(targetDay) {
    const result = new Date();
    const currentDay = result.getDay();

    let daysToAdd = (targetDay - currentDay + 7) % 7;

    if (daysToAdd === 0) {
      daysToAdd = 7;
    }

    result.setDate(result.getDate() + daysToAdd);
    return result;
  }

  async function book(cls) {
    setIsBooking(cls.id);
    setSuccess("");
    setBookingError("");
    const bookDate = getUpcomingDate(cls.day_of_week).toISOString();
    const booking = await apiFetch("/bookings", "POST", {
      gym_class_id: cls.id,
      class_date: bookDate,
    });

    if (!booking.success) {
      setBookingError(cls.id);
    }

    if (booking.success) {
      setSuccess(cls.id);
      console.log(success);
    }
    setIsBooking(false);
  }

  useEffect(() => {
    console.log(subscriptions);
  });

  if (isLoading || subscriptionsLoading) return <div>loading</div>;
  if (error || subscriptionsError)
    return <div>error occured, pls try again later</div>;

  const filteredSubs = subscriptions.response.filter((sub) => {
    return sub.subscription_status === "active";
  });

  return (
    <div className="text-center">
      <h1 className="tracking-wide text-2xl mb-5 lg:mb-10 font-light">
        classes:{" "}
      </h1>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-10 justify-items-center mb-10">
        {data.data.map((cls) => (
          <div
            key={cls.id}
            className="bg-gray-50 rounded-lg shadow-md w-xs p-5 duration-200 hover:scale-110"
          >
            <h1 className="text-lg font-bold mb-3 text-cyan-600">
              {cls.class_name}
            </h1>
            <p>day: {days[cls.day_of_week]}</p>
            <p className="my-2">duration: {cls.duration}</p>
            <p>gym: {cls.gym}</p>
            <p className="my-2">starts at: {cls.starts_at}</p>
            <p>
              trainer: <span className="text-emerald-600">{cls.trainer}</span>
            </p>
            {filteredSubs.length > 0 && isBooking !== cls.id && (
              <button
                className="cursor-pointer my-5 w-fit p-2 px-4 bg-blue-500 rounded-lg text-md text-white"
                onClick={() => book(cls)}
              >
                book upcoming class
              </button>
            )}
            {filteredSubs.length > 0 && isBooking === cls.id && (
              <button
                disabled
                className="cursor-not-allowed my-5 w-fit p-2 px-4 bg-blue-200 rounded-lg text-md text-white"
              >
                booking...
              </button>
            )}
            {bookingError === cls.id && (
              <p className="text-sm text-red-500">
                error booking, either class is full or you have already booked
                this upcoming class
              </p>
            )}
            {success === cls.id && (
              <p className="text-green-500 text-sm">booked successfully</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
