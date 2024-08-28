// utils/fetchUserData.js
import { getSession } from "next-auth/react";

export const GetSession = async () => {
  const session = await getSession();

  if (session) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send data");
    }

    return await response.json();
  } else {
    throw new Error("No session found");
  }
};
