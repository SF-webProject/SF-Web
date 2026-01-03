# SF-Web 개발/협업 규칙

## 브랜치
- 기본 개발: `develop`
- 배포(필요 시): `main`
- 작업 브랜치: `feature/*`, `fix/*`, `chore/*`, `docs/*`

## 작업 흐름
1) `develop`에서 작업 브랜치 생성
2) 커밋 후 원격 푸시
3) PR 생성 (base: develop)
4) CI 통과 확인
5) 최소 1명 Approve 후 merge (Squash 권장)

## 로컬 실행
- 설치: `pnpm install`
- 개발 서버: `pnpm dev`
- 린트: `pnpm lint`
- 빌드: `pnpm build`

## 주의
- `develop`/`main` 직접 push 금지(항상 PR)
- 비밀키/DB 비번 등은 코드에 올리지 말 것(.env + GitHub Secrets 사용)
