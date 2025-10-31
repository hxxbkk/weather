# 🌤️ React 날씨 앱 (Weather App)

React와 OpenWeatherMap API를 활용하여 만든 실시간 날씨 정보 웹 애플리케이션입니다.

주요 기능으로 **현재 위치 기반 날씨 조회**, **지역 검색**, React State를 활용한 **세션 기반 검색 기록** 및 **다크 모드**를 지원합니다.
<br />

🔗 **프로젝트 배포 링크:** [https://hxxbkk.github.io/weather/](https://hxxbkk.github.io/weather/)

<br />

## 📸 실행 화면

![image](https://github.com/user-attachments/assets/1d53eeaf-b6d2-46a9-a0ef-1bf65d9af96d)
<br />

## 💻 사용 기술 스택

* **Core:** React.js, JavaScript (ES6+)
* **Bundler:** **Vite**
* **API:**
    * **Browser Geolocation API** (현재 위치 조회)
    * OpenWeatherMap **Weather API** (날씨 정보)
    * OpenWeatherMap **Air Pollution API** (미세먼지 정보)
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Styling:** CSS (구름 애니메이션, 다크 모드 UI 구현)
* **DevOps:** `.env` (API 키 분리)

<br />

## ✨ 핵심 기능

* **1. 현재 위치 날씨/미세먼지 조회 (Geolocation API)**
    * 페이지 접속 시 브라우저의 `navigator.geolocation.getCurrentPosition` API(`getWeatherLocation` 함수)를 호출하여 사용자 동의 하에 현재 위도/경도 값을 가져옵니다.
    * 받아온 좌표로 날씨 및 미세먼지 정보를 조회합니다.

* **2. 도시 검색 및 연쇄 API 호출 (Chained API Calls)**
    * 도시 이름으로 날씨를 검색(`getWeatherByCity`)합니다.
    * 날씨 API 응답에서 받은 **좌표(`coord`)**를 추출하여, **두 번째 API(`fetchAirPolution`)**를 연쇄적으로 호출, **미세먼지 정보(pm10, pm2.5)**를 함께 가져와 표시합니다.

* **3. 세션 기반 검색 기록 (React State)**
    * 검색한 도시 이름은 `history` **React 상태 배열**에 저장됩니다. (새로고침 시 초기화)
    * '검색기록 보기/숨기기' 토글(`showHistory` 상태)이 가능합니다.
    * `history.map` 내 `onClick` 이벤트를 통해, **검색 기록을 클릭하여 해당 도시의 날씨를 재조회**할 수 있습니다.

* **4. 다크 모드 (React State & useEffect)**
    * `theme` 상태를 'light'/'dark'로 토글(`toggleTheme` 함수)합니다.
    * `useEffect` 훅이 `theme` 상태를 감지하여 `document.body`에 'dark' 클래스를 동적으로 추가/제거하는 방식으로 테마를 적용합니다.

* **5. 로딩 및 에러 핸들링**
    * API 호출 시 `loading` 상태를 true로 변경하여 **`<Spinner />` 컴포넌트**를 렌더링합니다.
    * `try...catch` 문을 사용하여 API 호출 실패 또는 Geolocation 거부 시 `error` 상태에 에러 메시지를 저장하고, 사용자에게 `'{error}'` 메시지를 명확히 보여줍니다.

* **6. 동적인 UI/UX (CSS Animation)**
    * CSS `@keyframes`를 사용하여 구름이 움직이는 듯한 애니메이션을 추가, 화면에 생동감을 더했습니다.

<br />

## 💡 프로젝트 회고 (알게 된 점)

* 이번 프로젝트에 처음으로 **Vite**를 번들러로 사용해 보았습니다. 기존 CRA(Create React App) 대비 **월등히 빠른 빌드 속도와 핫 리로딩(HMR)** 속도를 경험하며, 개발 과정에서의 효율성이 크게 향상되는 것을 체감할 수 있었습니다.

---

### ⚙️ 실행 방법

```bash
# 필요한 패키지를 설치합니다.
npm install

# Vite 개발 서버를 실행합니다.
npm run dev
