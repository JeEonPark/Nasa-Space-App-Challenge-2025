# CUPOLA QUEST 🚀🌍

> ISS의 관측 창(Cupola)에서 내려다본 실제 지구 사진으로 즐기는 인터랙티브 위치 추측 게임

- 데모: https://cupola-quest.vercel.app
- 플랫폼: 웹

## 🛰️ Summary
CUPOLA QUEST는 국제우주정거장(ISS) Cupola에서 촬영된 실제 지구 사진을 활용해, 사진이 어디에서 찍혔는지 세계 지도 위에 핀을 놓아 맞히는 웹 기반 게임입니다. 정답 위치와의 거리 정확도, 그리고 응답 속도 두 가지를 점수에 반영하여, “보는 경험”을 “발견하는 경험”으로 바꿉니다. NASA의 공개 데이터를 게임 메커닉과 인터랙션 디자인으로 재해석해, 남녀노소 누구나 우주비행사의 시선으로 지구를 탐험하도록 돕습니다. 

“게임을 하다 보니, 어느새 우주를 좋아하게 됐다.” — CUPOLA QUEST가 전하고 싶은 경험입니다.

## 🎮 How It Works
- 실제 ISS 사진 보기: 라운드를 시작하면 Cupola에서 촬영한 지구 사진이 표시됩니다.
- 지도에서 추측하기: 3D 지구본(MapLibre GL) 위를 회전/확대·축소하며 촬영 위치를 추측합니다.
- 핀 찍고 제출: 지도를 클릭해 좌표를 선택한 뒤 제출합니다.
- 결과 확인: 정답 위치와 나의 추측 지점을 선으로 연결해 보여주고, 거리 점수 + 시간 보너스를 합산한 라운드 점수를 확인합니다.
- 다시 도전: 홈으로 돌아가 새 라운드를 시작해 더 높은 점수에 도전하세요.

## 🏆 Scoring
- 거리 점수(최대 7,000점): 거리 기반. 정답에 가까울수록 높은 점수입니다.
- 시간 보너스(최대 3,000점): 빠르게 제출할수록 보너스가 큽니다(10초 이내 최대, 180초 이후 0점).
- 총점: 거리 점수 + 시간 보너스 = 라운드당 최대 10,000점.

## ✨ Features
- 3D 지구본 인터랙션: 회전·확대/축소, 클릭으로 마커 배치 🗺️
- 실시간 시간 보너스 바: 답변 시간이 점수에 미치는 영향 시각화 ⏱️
- 반응형 UI: 데스크톱·모바일 모두 자연스러운 레이아웃 📱
- 라운드 기반 진행: 결과 확인 후 손쉽게 재도전 🔁

## 🛠️ Tech Stack
- React + TypeScript — 현대적 프론트엔드와 타입 안정성
- Vite — 빠른 개발 서버 및 번들링
- MapLibre GL JS — 3D 글로브 렌더링과 인터랙션
- Python — NASA 이미지/메타데이터 수집·정제(사전 데이터 준비 용도)
- Node.js & npm — 패키지 관리와 스크립트 실행
- Git — 버전 관리
- Vercel — 클라우드 배포(https://cupola-quest.vercel.app)

## 📚 NASA Data & Credits
CUPOLA QUEST는 NASA의 오픈 데이터와 리소스를 기반으로 합니다. 본 프로젝트는 NASA의 승인·지지·후원을 의미하지 않습니다.

- 데이터 소스 예시
  - NASA Earth Observatory 컬렉션(예: Earth Observatory 아티클 및 이미지 세트)
  - Gateway to Astronaut Photography of Earth (JSC EOL)
  - 이미지 식별자 포맷 예: `ISS064-E-6310`, `ISS062-E-117852` 등
- 참조 이미지/주제 예시
  - “Parmitano with camera in Cupola”
  - “Cupola with Shutters Open”
  - “ISS062-E-117852”

## 🚀 Getting Started (Local)
- 요구 사항: Node.js 18+ 권장

```bash
npm install
npm run dev
```

- 프로덕션 빌드/미리보기
```bash
npm run build
npm run preview
```

배포는 Vercel을 사용합니다. 리포지토리를 연결하면 `main` 브랜치 빌드 후 자동 배포되도록 설정할 수 있습니다.

## 👀 How to Play
1) 사진을 관찰하세요. 색·지형·해안선·도시 조명 등 단서를 찾습니다.
2) 3D 지구본을 돌려가며 후보 지역을 좁힙니다.
3) 지도를 클릭해 핀을 놓고 제출합니다.
4) 정답 위치와의 거리·시간 보너스가 합산되어 점수가 표시됩니다.
5) 홈으로 돌아가 새로운 라운드를 시작하세요.

## 🙏 Acknowledgements
- NASA Earth Observatory, Gateway to Astronaut Photography of Earth(JSC)
- 오픈소스 커뮤니티(MapLibre GL, React 등)

즐겁게 플레이하시고, 우주비행사의 시선으로 지구를 다시 사랑해 보세요! 🌏✨

---
문의/피드백 환영합니다. 이슈 혹은 PR로 함께 발전시켜 주세요. 🙌
