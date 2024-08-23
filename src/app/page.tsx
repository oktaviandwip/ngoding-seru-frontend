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
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";

const frontendList = [
  { image: javascript, alt: "Javascript", link: "/javascript" },
  { image: typescript, alt: "Typescript", link: "/typescript" },
  { image: react, alt: "React", link: "/react" },
  { image: nextjs, alt: "Nextjs", link: "/nextjs" },
  { image: tailwindcss, alt: "TailwindCSS", link: "/tailwindcss" },
];

const backendList = [
  { image: nodejs, alt: "Nodejs", link: "/nodejs" },
  { image: go, alt: "Go", link: "/go" },
  { image: postgresql, alt: "Postgresql", link: "/postgresql" },
  { image: mysql, alt: "Mysql", link: "/mysql" },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="space-y-12">
      <div className="space-y-6">
        <h1 className="flex justify-center md:justify-start text-comment">
          {"/* frontend */"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {frontendList.map((v) => (
            <Card
              key={v.alt}
              className="flex items-center justify-between bg-primary text-white px-4 py-2 md:p-2"
              onClick={() => router.push(`/quiz/${v.link}`)}
            >
              <div className="flex items-center font-bold tracking-widest space-x-4">
                <Image src={v.image} alt={v.alt} width={50} height={50} />
                <p>{v.alt}</p>
              </div>
              <div className="rounded-full border p-1">
                <Icon icon="mage:chevron-down" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="flex justify-center md:justify-start text-comment">
          {"/* backend */"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {backendList.map((v) => (
            <Card
              key={v.alt}
              className="flex items-center justify-between bg-primary text-white px-4 py-2 md:p-2"
              onClick={() => router.push(`/quiz/${v.link}`)}
            >
              <div className="flex items-center font-bold tracking-widest space-x-4">
                <Image src={v.image} alt={v.alt} width={50} height={50} />
                <p>{v.alt}</p>
              </div>
              <div className="rounded-full border p-1">
                <Icon icon="mage:chevron-down" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
