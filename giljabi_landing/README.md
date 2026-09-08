# 길잡이 랜딩 페이지

제출용 "서비스 링크"가 되는 정적 소개 페이지. 디자인 시스템(Trust Blue·Warm Amber·Pretendard·마스코트)을 재활용한 단일 `index.html`.

## Vercel 배포

정적 사이트라 빌드가 필요 없다. 심사 기간 내내 상시 접속(콜드스타트 없음).

1. https://vercel.com 로그인 → **Add New → Project** → 이 GitHub 저장소 선택
2. **Root Directory** 를 `giljabi_landing` 로 지정
3. Framework Preset: **Other**, Build Command 비움, Output Directory 비움(루트)
4. Deploy → 발급된 URL(예: `https://giljabi.vercel.app`)이 **제출용 서비스 링크**

> 로컬 미리보기: `giljabi_landing/index.html` 을 브라우저로 열기.

## 채울 것

- 데모 영상: `#demo` 섹션의 플레이스홀더를 실제 영상 임베드로 교체
- APK 링크: `#download` 의 버튼이 GitHub Releases 를 가리킴 → 릴리스에 APK 업로드
