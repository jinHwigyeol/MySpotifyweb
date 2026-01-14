<h1>Spotify Web Player Clone</h1>

Spotify Web API를 활용하여 제작한 반응형 웹 플레이어 클론 프로젝트입니다. 사용자의 재생 상태를 실시간으로 동기화하고, 플레이리스트 및 트랙 정보를 직관적으로 제공하는 데 중점을 두었습니다.
<br>
아직 미완성이며, 추후 변경될 여지가 있습니다.
<br>
<br>

<h2>Netlify 주소</h2>
https://salvationsedge.netlify.app

<br>
<br>

<h2>🚀 주요 기능</h2>

<ul>
<li><b>Spotify OAuth 인증</b>: Spotify 계정을 통한 안전한 사용자 인증 및 권한 부여.</li>
<li><b>실시간 재생 상태 동기화</b>: 현재 재생 중인 곡, 아티스트, 앨범 아트 및 진행 상태 실시간 표시.</li>
<li><b>플레이리스트 탐색</b>: 사용자의 라이브러리에 저장된 플레이리스트 목록 조회 및 상세 트랙 리스트 렌더링.</li>
<li><b>컨텍스트 기반 자동 강조</b>: 현재 재생 중인 곡이 포함된 플레이리스트를 사이드바에서 시각적으로 강조.</li>
<li><b>스마트 스크롤 (Smart Scroll)</b>: 플레이리스트 상세 페이지 진입 시, 현재 재생 중인 트랙 위치로 자동 스크롤.</li>
<li><b>반응형 UI</b>: Tailwind CSS를 활용하여 다양한 디바이스 환경에 최적화된 레이아웃 제공.</li>
</ul>
<br>
<h2>🛠 기술 스택</h2>

<ul>
<li><b>Frontend</b>: React (v18), Vite, Tailwind CSS</li>
<li><b>Icons</b>: Lucide-React</li>
<li><b>API</b>: Spotify Web API</li>
<li><b>Deployment</b>: Netlify (Functions 활용을 통한 API 통신 최적화)</li>
</ul>
<br>

<h2>🌐 배포 관련</h2>

<p>본 프로젝트는 <b>Netlify Functions</b>를 사용하여 백엔드 프록시 서버를 구축했습니다.</p>
<ul>
<li><code>/functions/refresh.js</code>: 토큰 교환 및 리프레시 로직 담당.</li>
<li><code>netlify.toml</code>: 리다이렉트 규칙 및 빌드 설정 관리.</li>
</ul>
<br>
<h2>🛡 프라이버시 및 보안</h2>

<ul>
<li>본 앱은 사용자의 데이터를 별도의 서버에 저장하지 않으며, 모든 인증은 Spotify의 보안 프로토콜을 따릅니다.</li>
<li><code>Access Token</code>은 클라이언트 측 로컬 스토리지에 임시 저장되며, 브라우저 종료 시 혹은 만료 시 안전하게 처리됩니다.</li>
</ul>
<br>
📄 라이선스

This project is licensed under the MIT License.
