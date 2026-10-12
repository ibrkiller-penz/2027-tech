# 기술·가정 수업 홈페이지 (고등학교 · 천재교육)

정적 웹사이트입니다. 빌드 없이 `index.html`을 열면 됩니다.

## 내용 채우기
1. 자료(PDF·PPT 등)를 `materials/` 폴더에 넣습니다.
2. `js/data.js`에서 단원·차시·자료 경로를 적습니다.

## 공개하기 (GitHub Pages)
저장소 Settings → Pages → Branch 선택 → Save.

> 교과서 원본 PDF는 저작권 문제가 있으니 공개 저장소에 올리지 마세요. 직접 만든 수업 자료 위주로 올리는 것을 권장합니다.

## Firebase Hosting 배포
1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트를 만들고 Hosting을 시작합니다.
2. 프로젝트 설정 → 서비스 계정 → **새 비공개 키 생성**으로 JSON 키를 받습니다.
3. GitHub 저장소 Settings → Secrets and variables → Actions에서
   - Secrets: `FIREBASE_SERVICE_ACCOUNT` = JSON 키 내용 전체
   - Variables: `FIREBASE_PROJECT_ID` = 프로젝트 ID
4. 이 브랜치나 main에 push하면 자동 배포됩니다. 주소: `https://<프로젝트ID>.web.app`
