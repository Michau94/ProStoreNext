export { auth as proxy } from "./auth";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
<<<<<<< HEAD
=======

>>>>>>> 7ccfeb69f830ab67704048e525b6e1f25975315a
export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  const user = process.env.WALL_USER;
  const pass = process.env.WALL_PASS;

  if (!auth) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure"' },
    });
  }

  const [, encoded] = auth.split(" ");
  const decoded = Buffer.from(encoded || "", "base64").toString();
  const [u, p] = decoded.split(":");

  if (u === user && p === pass) return NextResponse.next();

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure"' },
  });
}
