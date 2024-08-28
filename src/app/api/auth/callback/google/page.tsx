// pages/api/auth/callback/google.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session) {
    // Handle authenticated session
    res.redirect("/");
  } else {
    // Handle unauthenticated session
    res.redirect("/login");
  }
}
