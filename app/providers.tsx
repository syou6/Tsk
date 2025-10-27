"use client";

import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </>
  );
}
