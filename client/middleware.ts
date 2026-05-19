import {
  NextRequest,
  NextResponse,
} from "next/server";

/*
 =====================================
 PROTECTED ROUTES
 =====================================
*/

const protectedRoutes = [

  "/dashboard",

  "/analysis",

  "/simulation",

  "/reports",

  "/settings",
];

/*
 =====================================
 AUTH ROUTES
 =====================================
*/

const authRoutes = [

  "/login",

  "/register",
];

/*
 =====================================
 MIDDLEWARE
 =====================================
*/

export function middleware(
  request: NextRequest
) {

  const token =
    request.cookies.get(
      "token"
    )?.value;

  const pathname =
    request.nextUrl.pathname;

  /*
   =====================================
   BLOCK UNAUTHENTICATED USERS
   =====================================
  */

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>

        pathname.startsWith(
          route
        )
    );

  if (
    isProtectedRoute &&
    !token
  ) {

    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )
    );
  }

  /*
   =====================================
   BLOCK AUTH PAGES
   FOR LOGGED-IN USERS
   =====================================
  */

  const isAuthRoute =
    authRoutes.includes(
      pathname
    );

  if (
    isAuthRoute &&
    token
  ) {

    return NextResponse.redirect(

      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}

/*
 =====================================
 MATCHER
 =====================================
*/

export const config = {

  matcher: [

    "/dashboard/:path*",

    "/analysis/:path*",

    "/simulation/:path*",

    "/reports/:path*",

    "/settings/:path*",

    "/login",

    "/register",
  ],
};