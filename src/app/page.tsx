"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import javascript from "@/assets/javascript.svg";
import typescript from "@/assets/typescript.svg";
import react from "@/assets/react.svg";
import nextjs from "@/assets/nextjs.svg";
import tailwindcss from "@/assets/tailwindcss.svg";
import go from "@/assets/go.svg";
import nodejs from "@/assets/nodejs.svg";
import postgresql from "@/assets/postgresql.svg";
import mysql from "@/assets/mysql.svg";
import mongodb from "@/assets/mongodb.svg";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import photoProfile from "@/assets/photo-profile.svg";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import Login from "@/components/Login";
import { getStat } from "@/store/reducer/stat";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { login } from "@/store/reducer/auth";
import { getProfile } from "@/store/reducer/user";

const frontendList = [
  { image: javascript, alt: "Javascript", link: "/javascript" },
  { image: typescript, alt: "Typescript", link: "/typescript" },
  { image: react, alt: "React", link: "/react" },
  { image: nextjs, alt: "Nextjs", link: "/nextjs" },
  { image: tailwindcss, alt: "Tailwind", link: "/tailwindcss" },
];

const backendList = [
  { image: nodejs, alt: "Nodejs", link: "/nodejs" },
  { image: go, alt: "Go", link: "/go" },
  { image: postgresql, alt: "Postgresql", link: "/postgresql" },
  { image: mysql, alt: "Mysql", link: "/mysql" },
  { image: mongodb, alt: "MongoDB", link: "/mongodb" },
];

// Number Format
const formatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

type Data = {
  email: string;
  password: string;
  isGoogle: boolean;
  full_name: string;
};

export default function Home() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState<Data>({
    email: "",
    password: "",
    isGoogle: false,
    full_name: "",
  });

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const { stat } = useSelector((state: RootState) => state.stat);
  const { data: session } = useSession();

  // Handle Toast
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

  // Handle Submit
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
    if (session) {
      console.log("sampai");
      setData((prevData) => ({
        ...prevData,
        image: session.user?.image || "",
        email: session.user?.email || "",
        full_name: session.user?.name || "",
        isGoogle: true,
      }));
    } else {
      console.log("sini");
    }
  }, [session]);

  useEffect(() => {
    if (data.isGoogle) {
      handleSubmit();
    }
  }, [data.isGoogle]);

  // Handle Card Click
  const handleCardClick = (link: string) => {
    if (isAuth) {
      router.push(`/quiz/${link}`);
    } else {
      setShowLogin(true);
    }
  };

  // Get Stat
  useEffect(() => {
    const getScore = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/stats/?user_id=${profile?.Id}`
      );

      if (response.ok) {
        const { data } = await response.json();
        dispatch(getStat(data));
      }
    };

    getScore();
  }, [isAuth]);

  return (
    <>
      <main className="space-y-6 mb-10">
        <div className="relative w-full flex flex-col items-center space-y-14">
          <div className="text-xl">
            {`${
              profile?.Full_name
                ? "Selamat Datang, " + profile?.Full_name.split(" ")[0]
                : "Selamat Datang 👋"
            }`}
          </div>
          <div className="border w-[248px] h-40 rounded-xl">
            <div className="border-t-[1px] mt-12">
              <div className="w-full grid grid-cols-2 justify-center text-center font-bold py-3">
                <div className="border-r">
                  <p className="text-blue">score</p>
                  <p>{stat?.Total_score || 0}</p>
                  <p className="text-xs">
                    <span className="text-purple">highest</span>{" "}
                    {stat?.Highest_score || 0}
                  </p>
                </div>
                <div>
                  <p className="text-blue">rank</p>
                  <p>{stat?.Rank || 0}</p>
                  <p className="text-xs">
                    <span className="text-purple">from </span>
                    {formatter.format(parseInt(stat?.Count || "0"))}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center rounded-full text-[10px] bg-primary border w-20 p-1 mt-2 ml-20">
              Full Stats
            </div>
          </div>
          <Image
            src={profile?.Image || photoProfile}
            alt={"Photo profile"}
            width={70}
            height={70}
            className="absolute border-2 rounded-full -top-4 bg-primary"
          />
        </div>

        <Tabs
          defaultValue="frontend"
          className="flex flex-col items-center space-y-6"
        >
          <TabsList className="grid w-full md:w-[248px] grid-cols-2 bg-primary border pt-2 pb-11 px-2">
            <TabsTrigger
              value="frontend"
              className="font-bold tracking-widest text-white text-base"
            >
              frontend
            </TabsTrigger>
            <TabsTrigger
              value="backend"
              className="font-bold tracking-widest text-white text-base"
            >
              backend
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="frontend"
            className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {frontendList.map((v) => (
              <Card
                key={v.alt}
                className="group flex items-center justify-between bg-primary text-white px-4 py-2 hover:bg-white hover:text-primary"
                onClick={() => handleCardClick(v.link)}
              >
                <div className="flex items-center font-bold tracking-widest space-x-4">
                  <Image src={v.image} alt={v.alt} width={50} height={50} />
                  <p>{v.alt}</p>
                </div>
                <div className="rounded-full border p-1 group-hover:border-primary">
                  <Icon icon="mage:chevron-right" />
                </div>
              </Card>
            ))}
          </TabsContent>
          <TabsContent
            value="backend"
            className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-y-8 gap-x-6"
          >
            {backendList.map((v) => (
              <Card
                key={v.alt}
                className="group flex items-center justify-between bg-primary text-white px-4 py-2 hover:bg-white hover:text-primary -mt-2"
                onClick={() => handleCardClick(v.link)}
              >
                <div className="flex items-center font-bold tracking-widest space-x-4">
                  <Image src={v.image} alt={v.alt} width={50} height={50} />
                  <p>{v.alt}</p>
                </div>
                <div className="rounded-full border p-1 group-hover:border-primary">
                  <Icon icon="mage:chevron-right" />
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      {/* Login Popover */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
          <Login setShowLogin={setShowLogin} session={session} />
        </div>
      )}
    </>
  );
}
