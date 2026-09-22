"use client";
import useSWR from "swr";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) => fetch(API_URL + url).then((r) => r.json());

export default function Home() {
  const { data, error, isLoading } = useSWR("/gyms-and-classes", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>an error occured, please try again later</div>;
  return (
    <div className="text-center">
      <nav className="text-sm md:text-xl w-full grid grid-cols-2 p-3 bg-gray-50 shadow-md rounded-2xl mb-10">
        <div className="mr-auto ml-10">GymFlow</div>
        <div className="ml-auto mr-10">
          <Link href="/login" className="mr-10 text-blue-400">
            Login
          </Link>
          <Link href="/register" className="text-blue-400">
            Register
          </Link>
        </div>
      </nav>
      <h1 className="my-5 text-3xl font-light md:my-8">Gyms:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {data.map((gym) => (
          <div
            key={gym.id}
            className="w-3xs md:w-2xs lg:w-xs py-4 bg-gray-100 rounded-xl hover:scale-110 duration-200"
          >
            <h1 className="text-lg font-bold mb-3 text-cyan-600">{gym.name}</h1>
            <div className="my-3">contact number: {gym.contact_number}</div>
            <div>location: {gym.location}</div>

            <ul className="mt-5">
              <h2 className="text-emerald-600 text-xl">classes:</h2>
              {gym.gym_classes.map((cls) => (
                <li key={cls.id} className="my-2">
                  {cls.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
