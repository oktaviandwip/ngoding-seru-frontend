"use client";

// pages/api/auth/callback/google.ts
import { getSession } from "next-auth/react";

export default async function handler() {
  const session = await getSession();

  if (session) {
    // Handle authenticated session
    console.log("sukses");
  } else {
    // Handle unauthenticated session
    console.log("salah");
  }
}
