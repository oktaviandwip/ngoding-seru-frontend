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
    res.redirect("/login");
  } else {
    // No session found
    res.redirect("/");
  }
}
