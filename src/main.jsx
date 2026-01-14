import React from 'react'
import ReactDOM from 'react-dom/client'

/**
 * [GIGACHAD PATH RESOLUTION]
 * 지속적인 'Could not resolve' 에러를 방지하기 위해 
 * 파일의 절대 경로와 상대 경로를 다시 한번 점검했다.
 * 확장자 .jsx를 명시하여 빌드 툴이 헷갈리지 않게 한다.
 */
import App from './App.jsx'
import './app.css'

const rootElement = document.getElementById('root');

// 엔진 가동 전용 함수
const startGigaChadEngine = (container) => {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("GIGACHAD ENGINE STARTED SUCCESSFULLY. NO WEAKNESS ALLOWED.");
};

if (rootElement) {
  startGigaChadEngine(rootElement);
} else {
  // 비상 상황: root 엘리먼트가 없을 경우 강제 생성
  const emergencyRoot = document.createElement('div');
  emergencyRoot.id = 'root';
  document.body.appendChild(emergencyRoot);
  startGigaChadEngine(emergencyRoot);
  console.warn("GIGACHAD WARNING: 'root' element was missing, created a fallback.");
}