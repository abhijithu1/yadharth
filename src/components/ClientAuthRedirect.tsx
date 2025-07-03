"use client";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientAuthRedirect() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect from root or sign-in page
    if (
      isSignedIn &&
      (pathname === "/" || pathname === "/sign-in")
    ) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, pathname, router]);

  return null;
} 