// src/app/(sf)/layout.tsx
import type { ReactNode } from "react";
import AuthHeader from "@/components/AuthHeader";
import styles from "./sf.module.css";

export default function SfLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.sfPage}>
      <AuthHeader />
      {children}
    </div>
  );
}