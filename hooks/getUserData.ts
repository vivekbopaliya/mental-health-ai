"use client";

import { useState, useEffect } from "react";

export const useUserData = () => {
  const [data, setData] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include", 
        });
        if (!response.ok) {
          throw new Error((await response.json()).error || "Failed to fetch user data");
        }
        const result = await response.json();
        setData(result.payload); // Matches the `decoded.payload` return
      } catch (err: any) {
        setError(err.message);
      }
    };

    getData();
  }, []);

  return { data, error };
};