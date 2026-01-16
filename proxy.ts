import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

type SameSite = "lax" | "strict" | "none";

const parseSetCookie = (setCookieStr: string) => {
  const parts = setCookieStr.split(";").map((p) => p.trim());
  const [nameValue, ...attrs] = parts;

  const eqIndex = nameValue.indexOf("=");
  const name = eqIndex === -1 ? "" : nameValue.slice(0, eqIndex);
  const value = eqIndex === -1 ? "" : nameValue.slice(eqIndex + 1);

  const options: {
    path?: string;
    expires?: Date;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: SameSite;
  } = {};

  for (const attr of attrs) {
    const [rawKey, ...rest] = attr.split("=");
    const key = rawKey.toLowerCase();
    const val = rest.join("=");

    if (key === "path") options.path = val;
    else if (key === "expires") {
      const d = new Date(val);
      if (!Number.isNaN(d.getTime())) options.expires = d;
    } else if (key === "max-age") {
      const n = Number(val);
      if (!Number.isNaN(n)) options.maxAge = n;
    } else if (key === "httponly") options.httpOnly = true;
    else if (key === "secure") options.secure = true;
    else if (key === "samesite") {
      const s = val.toLowerCase();
      if (s === "lax" || s === "strict" || s === "none") options.sameSite = s;
    }
  }

  return { name, value, options };
};

const applySetCookie = (res: NextResponse, setCookie: string | string[]) => {
  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieStr of cookieArray) {
    const { name, value, options } = parseSetCookie(cookieStr);
    if (!name) continue;

    if (name === "accessToken" || name === "refreshToken") {
      res.cookies.set(name, value, options);
    }
  }
};

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isPrivateRoute = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let refreshedSetCookie: string | string[] | null = null;

  if (!accessToken && refreshToken) {
    try {
      const apiRes = await checkSession();

      if (apiRes.data?.success) {
        isAuthenticated = true;
        refreshedSetCookie = apiRes.headers["set-cookie"] ?? null;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuthRoute && isAuthenticated) {
    const res = NextResponse.redirect(new URL("/", req.url));
    if (refreshedSetCookie) applySetCookie(res, refreshedSetCookie);
    return res;
  }

  const res = NextResponse.next();
  if (refreshedSetCookie) applySetCookie(res, refreshedSetCookie);
  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
