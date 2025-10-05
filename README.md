# CUPOLA QUEST ✨🌍

국제우주정거장(ISS) Cupola 창에서 내려다본 실제 지구 사진으로 즐기는 인터랙티브 위치 추측 게임

- 바로 플레이: https://cupola-quest.vercel.app ▶️

## 개요

이 프로젝트는 ISS Cupola에서 촬영된 실제 지구 사진을 기반으로, 사진의 촬영 위치를 3D 지구본 위에 추측해보는 웹 애플리케이션입니다. 정답 공개 후에는 추측 위치와의 거리, 그리고 응답 시간을 바탕으로 점수가 계산되어 피드백이 제공됩니다. 구성 요소와 데이터, 점수 계산 방식은 아래에 상세히 기술되어 있습니다.

## 주요 기능

- 실제 ISS 사진 표시(회전 보정 포함) 🛰️
- 3D 지구본 인터랙션(MapLibre GL JS) 🌍
- 클릭으로 핀 배치 → 정답 공개 → 점수 계산 ⏱️
- 반응형 UI, 빠른 개발/빌드 흐름(Vite) ⚡

## 플레이 흐름

1. 시작 화면에서 탭하여 시작(`src/components/Welcome.tsx`).
2. 창 선택 화면에서 플레이 진입(`src/components/WindowSelector.tsx`).
3. 사진 화면에서 ISS 사진을 관찰(`src/components/PhotoDisplay.tsx`).
4. 지도 화면에서 위치 클릭으로 추측(`src/components/MapAnswer.tsx`).
5. 결과 화면에서 정답/추측/거리/점수 확인(`src/components/ScoreDisplay.tsx`).

## 조작 방법

- 사진 화면: “Guess the Location” 버튼 클릭으로 지도 화면으로 이동.
- 지도 화면: 마우스 드래그 회전, 휠 줌, 클릭으로 핀 배치.
- 결과 화면: 총점과 세부 점수 확인 후 “Back to Home”으로 재시작.

## 점수 체계(정확한 규칙)

- 거리 점수(최대 7,000점): 지구 최대 거리(πR, R=6371.0088km)를 기준으로 선형 감점
  - 공식: `score_distance = max(0, 7000 * (1 - distance_km / (π * 6371.0088)))`
- 시간 보너스(최대 3,000점): 10초 이내 3,000점, 10–180초 구간에서 로그 스케일로 감소, 180초 초과 0점
  - 의사코드: `t < 10 → 3000`, `10 ≤ t ≤ 180 → 3000 * (1 - sqrt( log(1+0.001*(t-10)) / log(1+0.001*170) ))`, `t > 180 → 0`
- 총점: `거리 점수 + 시간 보너스` (라운드 최대 10,000점)

구현 참조: `src/utils/calculate.ts`

## 빠른 시작 🚀

사전 요구사항
- Node.js 18+, npm 10+

설치/실행
```bash
npm install --include=dev
npm run dev
# 기본 포트: 5173 (Vite)
```

빌드/프리뷰
```bash
npm run build
npm run preview
```

## 사용 방법 🎮
- 사진 화면: 충분히 관찰한 뒤 “Guess the Location” 클릭
- 지도 화면: 드래그 회전, 휠 줌, 클릭으로 핀 배치
- 점수 화면: 정답/추측 위치와 거리·보너스·총점 확인 후 다음 라운드

## 주요 특징 ✨
- 진짜 ISS 사진 사용(오픈 데이터)📚
- MapLibre GL JS 기반 3D 지구본 인터랙션 🌍
- 반응형 UI, 빠른 로딩(Vite) ⚡

## 기술 스택 🔧
- React 19 + TypeScript
- Vite
- MapLibre GL JS
- Node.js, npm
- Vercel(배포)
- Python(외부 스크립트로 이미지/메타데이터 수집—리포지토리 내 스크립트는 포함되어 있지 않습니다)

## 데이터 출처 📦
- NASA Earth Observatory 정리 데이터: `src/data/earth_observatory.json`
- 이미지 자산: `public/iss_photos/*.JPG` (파일명=이미지 ID)
- 참고 항목 예시: Parmitano with camera in Cupola, Cupola with Shutters Open, ISS062-E-117852 등

표시되는 자료는 NASA 공개 자료를 바탕으로 하며, 본 프로젝트는 NASA의 후원·승인·추천을 의미하지 않습니다. NASA 로고/인시그니아 사용에는 별도 제한이 있을 수 있습니다(NASA Media Usage Guidelines 참고).

## 프로젝트 구조 🗂️
```
src/
├── App.tsx
├── components/ (Welcome, WindowSelector, PhotoDisplay, MapAnswer, ScoreDisplay)
├── data/ (earth_observatory.json, QuestionUtil.ts)
├── models/ (타입 정의)
├── utils/calculate.ts (거리/시간/총점 계산)
└── styles/theme.ts

public/
├── iss_photos/  # ISS 사진
└── images/ui/   # UI 자산
```

## 배포 🌐
- Vercel — https://cupola-quest.vercel.app

## 로드맵(간단) 🗺️
- 데일리/라운드 묶음 모드, 공유 카드/리더보드
- 힌트/난이도 개선(예: 대륙·기후대 힌트), 저대역폭 대응

---

Made with 🌌 using NASA open data — Not endorsed by NASA.
