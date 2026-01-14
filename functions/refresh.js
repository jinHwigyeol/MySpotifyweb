const fetch = require('node-fetch');

/**
 * --- GIGACHAD INTEGRATED AUTH ENGINE ---
 * 이 하나의 함수가 Callback과 Refresh를 모두 씹어먹는다.
 */
exports.handler = async (event) => {
  // Netlify Functions의 event.path는 "/.netlify/functions/auth" 등을 포함한다.
  const path = event.path;
  const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET;

  /**
   * 1. REFRESH ENGINE
   * 호출 경로에 'refresh'가 포함되어 있거나, 쿼리 파라미터에 refresh_token이 있을 때 작동한다.
   */
  if (path.includes('refresh') || event.queryStringParameters.refresh_token) {
    const refreshToken = event.queryStringParameters.refresh_token;
    
    if (!refreshToken) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "No refresh token provided. Focus!" }) 
      };
    }

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
      });

      const data = await response.json();

      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" // CORS 허용
        },
        body: JSON.stringify({
          access_token: data.access_token,
          expires_in: data.expires_in,
          // Spotify는 가끔 새 리프레시 토큰을 주기도 하니 같이 넘겨준다.
          refresh_token: data.refresh_token || refreshToken 
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GIGACHAD ENGINE FAILURE", details: err.message }),
      };
    }
  }

  /**
   * 2. CALLBACK ENGINE
   * 최초 로그인 후 Spotify에서 돌아올 때 실행된다.
   */
  const { code, error } = event.queryStringParameters;

  if (error) {
    return {
      statusCode: 302,
      headers: { "Location": `/?error=${encodeURIComponent(error)}` },
      body: "",
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: "No code found. Unauthorized access denied.",
    };
  }

  // 코드를 가지고 메인 페이지로 리다이렉트 (프론트엔드에서 처리하도록)
  return {
    statusCode: 302,
    headers: { "Location": `/?code=${code}` },
    body: "",
  };
};