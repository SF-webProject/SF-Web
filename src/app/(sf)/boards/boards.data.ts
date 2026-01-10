export const BOARDS = [
  { slug: "test-1", name: "테스트 1" },
  { slug: "test-2", name: "테스트 2" },
  { slug: "test-3", name: "테스트 3" },
] as const;

export const BOARD_NAME: Record<string, string> = Object.fromEntries(
  BOARDS.map((b) => [b.slug, b.name])
);