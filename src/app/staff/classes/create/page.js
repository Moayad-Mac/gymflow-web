"use client";
import React, { useState } from "react";
import useSWR from "swr";
import useApiFetch from "@/app/lib/apiFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((r) => r.json());

export default function CreateClass() {
  const {
    data: gyms,
    error: gymsError,
    isLoading: gymsLoading,
  } = useSWR("/gyms", fetcher);

  const {
    data: trainers,
    error: trainersError,
    isLoading: trainersLoading,
  } = useSWR("/trainers", fetcher);

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const apiFetch = useApiFetch();
  const [className, setClassName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [gymId, setGymId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("");
  const [duration, setDuration] = useState("");
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCreating(true);
    setErrors("");
    setGlobalError("");
    setSuccess(false);

    const data = await apiFetch("/gym-classes", "POST", {
      name: className,
      trainer_id: trainerId === "" ? null : trainerId,
      gym_id: gymId === "" ? null : gymId,
      duration: duration === "" ? null : duration,
      day_of_week: dayOfWeek === "" ? null : dayOfWeek,
      starts_at: startsAt === "" ? null : startsAt + ":00",
      capacity: capacity === "" ? null : capacity,
    });

    if (!data.success) {
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setGlobalError("error happened, pls try again later");
      }
    }
    if (data.success) {
      setSuccess(true);
    }
    setCreating(false);
  }

  if (gymsLoading || trainersLoading) return <div>loading...</div>;
  if (gymsError || trainersError) return <div>error, pls try again later</div>;
  return (
    <div className="w-3xs md:w-md lg:w-3xl m-auto h-1/2 p-6 bg-gray-100 rounded-2xl shadow-2xl">
      {globalError && <p className="text-red-500 text-sm">{globalError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="relative my-2 lg:my-10">
            <input
              type="text"
              name="name"
              placeholder=" "
              id="name"
              value={className}
              className="peer md:w-sm lg:w-50 block border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              onChange={(e) => {
                setClassName(e.target.value);
              }}
            />
            <label
              htmlFor="name"
              className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
            >
              class name
            </label>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="relative my-2 lg:my-10">
            <input
              type="number"
              name="duration"
              id="duration"
              placeholder=" "
              value={duration}
              className="peer block md:w-sm lg:w-50 border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              onChange={(e) => {
                setDuration(e.target.value);
              }}
            />
            <label
              htmlFor="duration"
              className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
            >
              duration
            </label>
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration}</p>
            )}
          </div>

          <div className="relative my-2 lg:my-10">
            <input
              type="number"
              name="capacity"
              id="capacity"
              placeholder=" "
              value={capacity}
              className="peer block md:w-sm lg:w-50 border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              onChange={(e) => {
                setCapacity(e.target.value);
              }}
            />
            <label
              htmlFor="capacity"
              className="absolute left-2 top-4 z-10 origin-left -translate-y-5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-600"
            >
              capacity
            </label>
            {errors.capacity && (
              <p className="text-red-500 text-sm">{errors.capacity}</p>
            )}
          </div>
        </div>
        <div className="my-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <select
            name="trainer_id"
            value={trainerId}
            onChange={(e) => {
              setTrainerId(e.target.value);
            }}
          >
            <option value="" disabled defaultChecked>
              choose trainer
            </option>
            {trainers.map((trainer) => (
              <option value={trainer.id} key={trainer.id}>
                {trainer.user.name}
              </option>
            ))}
          </select>

          {errors.trainer_id && (
            <p className="text-red-500 text-sm">please choose trainer</p>
          )}

          <select
            name="gym_id"
            value={gymId}
            onChange={(e) => {
              setGymId(e.target.value);
            }}
          >
            <option value="" disabled defaultChecked>
              choose gym
            </option>
            {gyms.map((gym) => (
              <option value={gym.id} key={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>
          {errors.gym_id && (
            <p className="text-red-500 text-sm">pls choose valid gym</p>
          )}

          <select
            name="day_of_week"
            value={dayOfWeek}
            onChange={(e) => {
              setDayOfWeek(e.target.value);
            }}
          >
            <option value="" disabled defaultChecked>
              choose day
            </option>
            {days.map((day) => (
              <option value={days.indexOf(day)} key={days.indexOf(day)}>
                {day}
              </option>
            ))}
          </select>
          {errors.day_of_week && (
            <p className="text-red-500 text-sm">{errors.day_of_week}</p>
          )}
        </div>
        <div className="my-10 text-center">
          <label>starts at</label>
          <input
            type="time"
            name="starts_at"
            value={startsAt}
            className="mx-3 md:mx-10 peer border-b border-gray-300 bg-transparent px-3 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            onChange={(e) => {
              setStartsAt(e.target.value);
            }}
          />
          {errors.starts_at && (
            <p className="text-red-500 text-sm">{errors.starts_at}</p>
          )}
        </div>

        <div className="text-center">
          {creating && (
            <button
              disabled
              className="bg-blue-200 p-2 px-3 rounded-md cursor-not-allowed text-bold text-white"
            >
              creating...
            </button>
          )}
          {!creating && (
            <button className="bg-blue-400 p-2 px-3 rounded-md cursor-pointer text-bold text-white">
              create class
            </button>
          )}
        </div>

        {success && (
          <p className="text-green-500 text-sm">class created successfully</p>
        )}
      </form>
    </div>
  );
}
