"use client";

// pages/api/auth/callback/google.ts
import { signIn, useSession } from "next-auth/react";

export default function Callback() {
  const { data: session } = useSession();

  if (session) {
    // Handle authenticated session
    console.log("sukses");
  } else {
    // Handle unauthenticated session
    console.log("salah");
  }
}
