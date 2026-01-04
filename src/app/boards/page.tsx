// src/app/boards/page.tsx
import Link from "next/link";

import { BOARDS } from "./boards.data";

export default function BoardsHomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>게시판</h1>
      <p style={{ marginTop: 8 }}>라우팅/화면 확인용도</p>

      <ul style={{ marginTop: 16, display: "grid", gap: 8 }}>
        {BOARDS.map((b) => (
          <li key={b.slug}>
            <Link href={`/boards/${b.slug}`}>{b.name} →</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}