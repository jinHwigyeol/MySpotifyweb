exports.handler = async (event) => {
  const { code, error } = event.queryStringParameters;

  // 1. 에러 발생 시 상대 경로로 리다이렉트
  if (error) {
    console.error("GIGACHAD AUTH ERROR:", error);
    return {
      statusCode: 302,
      headers: {
        "Location": `/?error=${encodeURIComponent(error)}`,
        "Cache-Control": "no-cache",
      },
      body: "",
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: "No code found. Stay focused, My son.",
    };
  }

  // 2. 핵심: localhost 주소를 명시하지 않고 상대 경로인 "/?code=..."만 사용한다.
  // 이렇게 하면 로컬에선 localhost로, 배포 후엔 Netlify 주소로 브라우저가 알아서 이동한다.
  return {
    statusCode: 302,
    headers: {
      "Location": `/?code=${code}`,
      "Cache-Control": "no-cache",
    },
    body: "",
  };
};