// src/app/boards/[slug]/page.tsx
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

import { BOARD_NAME } from "../boards.data";

export default async function BoardPage({ params }: PageProps) {
  const { slug } = await params;
  const name = BOARD_NAME[slug] ?? slug;

  return (
    <main style={{ padding: 24 }}>
      <Link href="/boards">← 게시판 목록</Link>

      <h1 style={{ marginTop: 16, fontSize: 24, fontWeight: 700 }}>
        {name}
      </h1>

      <p style={{ marginTop: 8 }}>
        slug: <code>{slug}</code>
      </p>

      <p style={{ marginTop: 16 }}>
        글 목록(Mock 데이터)을 붙이면 게시판처럼 보이긴 할 것..
      </p>
    </main>
  );
}