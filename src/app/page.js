"use client";
import useSWR from "swr";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url) => fetch(API_URL + url).then((r) => r.json());

export default function Home() {
  const { data, error, isLoading } = useSWR("/gyms-and-classes", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>an error occured, please try again later</div>;
  return (
    <div>
      <h1>Gyms:</h1>
      {data.map((gym) => (
        <div key={gym.id}>
          <h1>{gym.name}</h1>
          <div>contact number: {gym.contact_number}</div>
          <div>location: {gym.location}</div>

          <ul>
            classes:{" "}
            {gym.gym_classes.map((cls) => (
              <li key={cls.id}>{cls.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
