const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

exports.handler = async (event, context) => {
  const fetch = require('node-fetch');

/**
 * --- GIGACHAD HYBRID ENGINE ---
 * 1. 토큰이 있으면: 로그인한 사용자의 실시간 노래를 보여준다.
 * 2. 토큰이 없으면: 환경변수에 설정된 '강삣삐'의 노래를 박제해서 보여준다.
 */
exports.handler = async (event) => {
  const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET;

  
  const { type, refresh_token, access_token } = event.queryStringParameters;
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  // [기능 1] 토큰 리프레시 로직
  if (type === 'refresh') {
    const tokenToRefresh = refresh_token || MASTER_REFRESH_TOKEN;
    if (!tokenToRefresh) return { statusCode: 400, body: "No token to refresh" };

    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: tokenToRefresh
        })
      });
      const data = await res.json();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  // [기능 2] 재생 정보 가져오기
  if (type === 'currently-playing') {
    // 토큰이 없으면 마스터 토큰으로 수혈받는 로직이 추가로 필요하겠지만, 
    // 기본적으로 프론트에서 넘겨준 access_token을 우선시한다.
    let activeToken = access_token;

    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });

      if (res.status === 204 || res.status === 401) {
        // 재생 중이 아니면 최근 곡 가져오기
        const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        const recentData = await recentRes.json();
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_playing: false, item: recentData.items?.[0]?.track || null })
        };
      }

      const data = await res.json();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 400, body: "Invalid Request Type" };
};
};