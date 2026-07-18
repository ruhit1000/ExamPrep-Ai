"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "@heroui/react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save current location as a redirect parameter
      const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
