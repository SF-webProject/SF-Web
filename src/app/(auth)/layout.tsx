// src/app/(auth)/layout.tsx
import type { ReactNode } from "react";
import AuthHeader from "@/components/AuthHeader";
import styles from "./auth.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.authPage}>
      <AuthHeader />
      {children}
    </div>
  );
}