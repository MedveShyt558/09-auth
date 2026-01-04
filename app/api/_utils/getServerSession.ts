import type { NextRequest } from "next/server";

export const getServerSession = (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken")?.value ?? "";
  const refreshToken = req.cookies.get("refreshToken")?.value ?? "";

  return {
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken || refreshToken),
  };
};
