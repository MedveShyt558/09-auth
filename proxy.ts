import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

const applySetCookie = (res: NextResponse, setCookie: string | string[]) => {
  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);

    const options = {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: parsed.Path,
      maxAge: Number(parsed["Max-Age"]),
    };

    if (parsed.accessToken) {
      res.cookies.set("accessToken", parsed.accessToken, options);
    }

    if (parsed.refreshToken) {
      res.cookies.set("refreshToken", parsed.refreshToken, options);
    }
  }
};

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isPrivateRoute = PRIVATE_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );
  const isAuthRoute = AUTH_ROUTES.some((p) =>
    pathname.startsWith(p)
  );

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
    if (refreshedSetCookie) {
      applySetCookie(res, refreshedSetCookie);
    }
    return res;
  }

  const res = NextResponse.next();
  if (refreshedSetCookie) {
    applySetCookie(res, refreshedSetCookie);
  }

  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
