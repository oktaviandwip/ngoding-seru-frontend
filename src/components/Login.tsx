"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { login } from "@/store/reducer/auth";
import { getProfile } from "@/store/reducer/user";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

type Data = {
  email: string;
  password: string;
  isGoogle: boolean;
};

type Props = {
  setShowLogin: (show: boolean) => void;
};

const Login: React.FC<Props> = ({ setShowLogin }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { data: session } = useSession();
  const [data, setData] = useState<Data>({
    email: "",
    password: "",
    isGoogle: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle Toast
  const handleToast = (type: "success" | "error", desc: string) => {
    toast({
      description: desc,
      className: `${
        type === "success"
          ? "bg-success text-white"
          : "bg-destructive text-white"
      } fixed top-0 flex items-center justify-center inset-x-0 md:w-96 md:mx-auto p-4 border-none rounded-none md:rounded-lg z-[999]`,
    });
  };

  // Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
      isGoogle: false,
    }));
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
          setShowLogin(false);
          router.push("/"); // Redirect after successful login
        } else {
          console.error("Error:", res.statusText);
        }
      } else {
        const data = await response.json();
        handleToast("error", data.description);
        console.error("Login failed:", data.description);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    if (!session) {
      signIn("google");
    } else {
      setData((prevData) => ({
        ...prevData,
        isGoogle: true,
      }));
    }
  };

  useEffect(() => {
    if (session) {
      setData((prevData) => ({
        ...prevData,
        email: session.user?.email || "",
        image: session.user?.image || "",
        full_name: session.user?.name || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (data.isGoogle) {
      handleSubmit();
    }
  }, [data.isGoogle]);

  // Close when clicked outside card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowLogin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-10 pb-10">
      <Card
        className="relative w-[350px] bg-primary text-white shadow-md pt-2"
        ref={cardRef}
      >
        <div
          className="absolute top-2 right-6 text-lg cursor-pointer"
          onClick={() => setShowLogin(false)}
        >
          &times;
        </div>
        <CardHeader className="space-y-2">
          <CardTitle>Selamat Datang 👋</CardTitle>
          <CardDescription className="text-white">
            Masuk untuk dapat mengakses quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google */}
          <div
            className={`${
              showForm ? "hidden" : "flex"
            } flex-col items-center justify-center space-y-4`}
          >
            <Button className="w-full border" onClick={handleGoogleLogin}>
              <Icon icon="logos:google-icon" className="mr-2" />
              Google
            </Button>
            <div>
              atau masuk dengan{" "}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setShowForm(true)}
              >
                email
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={`${showForm ? "flex" : "hidden"} flex-col space-y-4`}
          >
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                placeholder="user@mail.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                placeholder="*********"
                onChange={handleChange}
                required={!data.isGoogle} // Password not required if signed in with Google
                className="pr-10"
              />
              <Icon
                icon={showPassword ? "mage:eye-off" : "mage:eye"}
                className="text-gray-500 text-lg absolute cursor-pointer bg-transparent top-6 right-3"
                onClick={() => setShowPassword(!showPassword)}
              />
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 mt-2 self-end"
              >
                Lupa password?
              </Link>
            </div>
            <Button type="submit" className="w-full border">
              Masuk
            </Button>
            <div className="text-center">
              atau masuk dengan{" "}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setShowForm(false)}
              >
                Google
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
