// pages/api/auth/callback/google.ts or .js

import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session) {
    // Session is available
    res.redirect("/"); // Redirect to home or other page
  } else {
    // No session found
    res.redirect("/login"); // Redirect to login page
  }
}
