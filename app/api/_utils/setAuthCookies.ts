import { serialize } from "cookie";
import type { NextResponse } from "next/server";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = (res: NextResponse, tokens: Tokens) => {
  res.headers.append(
    "Set-Cookie",
    serialize("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
  );

  res.headers.append(
    "Set-Cookie",
    serialize("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
  );
};
