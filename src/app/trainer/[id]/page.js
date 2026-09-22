"use client";
import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) =>
  fetch(API_URL + url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((res) => res.json());

export default function Post() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    `/gym-classes/${id}/roster`,
    fetcher,
  );

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

  return (
    <div className="text-center my-10">
      <Link
        href="/trainer"
        className="bg-blue-400 rounded-full text-white mx-8 my-4 fixed right-0 bottom-0 h-10 w-10 text-center font-extrabold text-2xl"
      >
        ←
      </Link>
      <div className="w-3xs md:w-2xs lg:w-xs py-4 bg-gray-100 rounded-xl hover:scale-110 duration-200 mx-auto my-10">
        <h1>
          class name:{" "}
          <span className="text-lg font-bold mb-3 text-cyan-600">
            {data.name}
          </span>
        </h1>
        <p>capacity: {data.capacity}</p>
        <p>day of week: {days[data.day_of_week]}</p>
        <p>duration: {data.duration}</p>
        <p>starts at: {data.starts_at}</p>
        <p>
          gym: <span className="text-emerald-600">{data.gym.name}</span>
        </p>
      </div>

      {data.bookings.length > 0 && (
        <div>
          <h1 className="my-5 text-xl font-light">bookings: </h1>
          <div className="grid grid-cols-2 md:grid-cols-3">
            {data.bookings.map((book) => (
              <p key={book.id}>
                <span className="text-emerald-600">
                  {book.member.user.name}:
                </span>{" "}
                {book.class_date.substr(0, 10)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
