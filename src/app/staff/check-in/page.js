"use client";
import useApiFetch from "@/app/lib/apiFetch";
import React, { useState } from "react";

export default function CheckIn() {
  const apiFetch = useApiFetch();
  const [bookingId, setBookingId] = useState("");
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  async function checkIn(e) {
    e.preventDefault();
    setChecking(true);
    setErrors({});
    setGlobalError("");
    setSuccess(false);

    const data = await apiFetch("/check-in", "POST", {
      booking_id: bookingId,
    });

    if (data.success) {
      setSuccess(true);
    } else {
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setGlobalError(data.message);
      }
    }
    setChecking(false);
  }

  return (
    <div className="w-3xs md:w-md mx-auto my-30 h-1/2 p-6 bg-gray-100 rounded-2xl shadow-2xl">
      <form onSubmit={checkIn} className="h-full">
        <div className="relative mb-10">
          <input
            type="number"
            placeholder=" "
            id="num"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="peer block w-full border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="num"
            className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            Booking id:{" "}
          </label>

          {errors?.booking_id && (
            <p className="text-red-500 text-sm mt-5">{errors.booking_id}</p>
          )}
        </div>

        <div className="text-center">
          {!checking && (
            <button className="cursor-pointer bg-blue-500 p-2 px-3 rounded-md text-lg text-white">
              submit
            </button>
          )}
          {checking && (
            <button
              className="cursor-not-allowed bg-blue-200 p-1 px-3 rounded-md text-lg text-white"
              disabled
            >
              submitting...
            </button>
          )}
        </div>

        <div className="text-center mt-6">
          {globalError && <p className="text-red-500 text-sm">{globalError}</p>}
          {success && (
            <p className="text-green-500 text-sm">checked in successfully</p>
          )}
        </div>
      </form>
    </div>
  );
}
