"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { login, getProfile } from "@/store/reducer/auth";
import type { AppDispatch } from "@/store";
import { GetSession } from "@/components/GetSession";

type Data = {
  email: string;
  password: string;
  isGoogle: boolean;
  full_name: string;
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
    full_name: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleToast = (type: "success" | "error", desc: string) => {
    toast({
      description: desc,
      className: `fixed top-0 inset-x-0 md:w-96 md:mx-auto p-4 border-none rounded-lg z-[999] ${
        type === "success"
          ? "bg-success text-white"
          : "bg-destructive text-white"
      }`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
      isGoogle: false,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
          handleToast("error", "Unexpected error occurred.");
        }
      } else {
        const errorData = await response.json();
        handleToast("error", errorData.description || "Login failed.");
      }
    } catch (error) {
      handleToast("error", "An error occurred while processing your request.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await GetSession();
        console.log(res);
        const { Token, User } = res.data;

        if (Token && User) {
          dispatch(getProfile(User));
          dispatch(login(Token));
          setShowLogin(false);
          router.push("/"); // Redirect after successful login
        } else {
          handleToast("error", "Session fetching failed.");
        }
      } catch (error) {
        handleToast("error", "An error occurred while fetching the session.");
        console.error("Error:", error);
      }
    };

    fetchSession();
  }, []);

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
        image: session.user?.image || "",
        email: session.user?.email || "",
        full_name: session.user?.name || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (data.isGoogle) {
      handleSubmit();
    }
  }, [data.isGoogle]);

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
          {!showForm ? (
            <div className="flex flex-col items-center justify-center space-y-4">
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
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
                  required={!data.isGoogle}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
