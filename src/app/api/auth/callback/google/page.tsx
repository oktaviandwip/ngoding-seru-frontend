"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { login } from "@/store/reducer/auth";
import { getProfile } from "@/store/reducer/user";

type Data = {
  email: string;
  password: string;
  isGoogle: boolean;
};

export default function AuthCallback() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [data, setData] = useState<Data>({
    email: "",
    password: "",
    isGoogle: false,
  });

  // Handle Toast
  const handleToast = (type: "success" | "error", desc: string) => {
    toast({
      description: desc,
      className: `${
        type === "success"
          ? "bg-secondary text-primary"
          : "bg-destructive text-white"
      } fixed top-0 flex items-center justify-center inset-x-0 p-4 border-none rounded-none`,
    });
  };

  // Handle Submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log("sampai");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const res = await response.json();
        const { Token, User } = res.data;

        if (Token && User) {
          dispatch(getProfile(User));
          dispatch(login(Token));
          router.push("/");
        } else {
          handleToast("error", res.statusText);
          console.error("Error:", res.statusText);
          router.push("/");
        }
      } else {
        const data = await response.json();
        handleToast("error", data.description);
        console.error("Login failed:", data.description);
        router.push("/");
      }
    } catch (error) {
      console.error("Error:", error);
      router.push("/");
    }
  };

  // Fetch Session
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setData((prevData) => ({
          ...prevData,
          email: session.user?.email || "",
          image: session.user?.image || "",
          isGoogle: true,
        }));
      } else {
        router.push("/");
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (data.isGoogle) {
      handleSubmit();
    }
  }, [data.isGoogle]);

  return <div></div>;
}
