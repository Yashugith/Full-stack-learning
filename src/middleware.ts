import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/login", "/api/auth"];

export default auth(function middleware(req: NextRequest & { auth?: { user?: { id?: string } } }) {
  const { pathname } = req.nextUrl;
  const session = (req as { auth?: { user?: { id?: string } } }).auth;

  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();
  if (pathname === "/") return NextResponse.next();

  if (!session?.user?.id) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
