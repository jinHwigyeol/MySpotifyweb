import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React 18 및 19 환경에서 'compiler-runtime' 관련 유효성 검사 에러를 방지하기 위해 
      // 명시적으로 jsxRuntime을 설정합니다.
      // 'automatic' 설정은 최신 React의 JSX 트랜스폼 방식을 따르도록 강제합니다.
      jsxRuntime: 'automatic',
    })
  ],
  publicDir: 'public',
  server: {
    // 로컬 개발 환경에서 발생할 수 있는 포트 충돌 및 리다이렉트 이슈를 방지합니다.
    port: 5173,
    strictPort: true,
  },
  build: {
    // 프로덕션 빌드 시 불필요한 에러 방지를 위해 타겟 사양을 최신으로 유지합니다.
    target: 'esnext'
  }
})