"use client";

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

const formatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export default function Home() {
  const router = useRouter();

  return (
    <main className="space-y-6 mb-10">
      <div className="relative w-full flex flex-col items-center space-y-14">
        <div className="text-xl">welcome, oktavian</div>
        <div className="border w-[248px] h-40 rounded-xl">
          <div className="border-t-[1px] mt-12">
            <div className="w-full grid grid-cols-2 justify-center text-center font-bold py-3">
              <div className="border-r">
                <p className="text-blue">score</p>
                <p>99.99</p>
                <p className="text-xs">
                  <span className="text-purple">from</span> 100
                </p>
              </div>
              <div>
                <p className="text-blue">rank</p>
                <p>99</p>
                <p className="text-xs">
                  <span className="text-purple">from </span>
                  {formatter.format(10000)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center rounded-full text-[10px] bg-primary border w-20 p-1 mt-2 ml-20">
            Full Stats
          </div>
        </div>
        <Image
          src={photoProfile}
          alt={"Photo profile"}
          width={70}
          height={70}
          className="absolute border-2 rounded-full -top-4"
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
              onClick={() => router.push(`/quiz/${v.link}`)}
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
          className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 md:gap-6"
        >
          {backendList.map((v) => (
            <Card
              key={v.alt}
              className="group flex items-center justify-between bg-primary text-white px-4 py-2 hover:bg-white hover:text-primary -mt-2"
              onClick={() => router.push(`/quiz/${v.link}`)}
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
  );
}
