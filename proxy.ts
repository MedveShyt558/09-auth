import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

const isPrivatePath = (pathname: string) => PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
const isAuthPath = (pathname: string) => AUTH_PREFIXES.some((p) => pathname.startsWith(p));

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const hasToken =
    Boolean(req.cookies.get("accessToken")?.value) ||
    Boolean(req.cookies.get("refreshToken")?.value);

  if (!hasToken && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (hasToken && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
