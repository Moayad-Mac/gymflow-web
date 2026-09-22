"use client";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((res) => res.json());

export default function TrainerPage() {
  const { data, error, isLoading } = useSWR("/gym-classes", fetcher);
  const router = useRouter();

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>error happened, pls try again later</div>;
  if (data.data.length === 0) return <div>you have no classes</div>;

  return (
    <div className="text-center my-10">
      <h1 className="my-5 text-3xl font-light md:my-8">Your classes:</h1>
      <div className="text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
        {data.data.map((cls) => (
          <Link
            key={cls.id}
            className="cursor-pointer w-3xs md:w-2xs lg:w-xs py-4 bg-gray-100 rounded-xl hover:scale-110 duration-200"
            href={`/trainer/${cls.id}`}
          >
            <h1 className="text-lg font-bold mb-3 text-cyan-600">
              {cls.class_name}
            </h1>
            <p>day of week: {days[cls.day_of_week]}</p>
            <p className="my-2">capacity: {cls.capacity}</p>
            <p>duration: {cls.duration}</p>
            <p className="my-2">starts at: {cls.starts_at}</p>
            <p>
              gym: <span className="text-emerald-600">{cls.gym}</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
