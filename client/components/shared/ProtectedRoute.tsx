"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/providers/AuthProvider";

export default function ProtectedRoute({

  children,

}: {
  children: React.ReactNode;
}) {

  const {
    user,
    loading,
  } = useAuth();

  const router =
    useRouter();

  /*
   =====================================
   REDIRECT IF NOT AUTHENTICATED
   =====================================
  */

  useEffect(() => {

    if (
      !loading &&
      !user
    ) {

      router.push(
        "/login"
      );
    }

  }, [
    user,
    loading,
    router,
  ]);

  /*
   =====================================
   LOADING STATE
   =====================================
  */

  if (
    loading ||
    !user
  ) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-white
        "
      >

        Loading...

      </div>
    );
  }

  return children;
}