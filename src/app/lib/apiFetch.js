"use client";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function useApiFetch() {
  const router = useRouter();

  const apiFetch = async (endpoints, method, body = null) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoints}`, {
      method,
      headers,

      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (response.status === 401 && token) {
      localStorage.removeItem("token");
      router.push("/login");
      return { success: false, message: "session expired" };
    }
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "An error occurred",
        errors: data.errors || null,
      };
    }
    return { success: true, data };
  };
  return apiFetch;
}
