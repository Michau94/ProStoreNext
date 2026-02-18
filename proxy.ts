import { NextResponse } from "next/server";
import { auth } from "./auth";

export const proxy = auth((request) => {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
});
