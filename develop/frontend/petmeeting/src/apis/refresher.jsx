import { useEffect } from "react";
import axios from "axios";
import { config } from "../static/config";
import { useNavigate } from "react-router-dom";

export default function TokenRefresher() {
  const navigate = useNavigate();

  useEffect(() => {
    // Create axios instance for authentication
    const authAPI = axios.create({
      baseURL: `${config.baseURL}`,
      headers: { "Content-type": "application/json" },
    });

    // Create axios instance for other requests
    const api = axios.create({
      baseURL: `${config.baseURL}`,
      headers: { "Content-type": "application/json" },
    });

    // Apply interceptor to 'api' instance
    const interceptor = api.interceptors.response.use(
      function (response) {
        console.log("인터셉트");
        return response;
      },
      async function (error) {
        console.log("인터셉트 에러 ");

        const originalRequest = error.config;

        if (sessionStorage.getItem("token") && error.response.status === 400) {
          console.log("액세스토큰 재발급");

          const tokenData = JSON.parse(sessionStorage.getItem("token"));

          // Use 'authAPI' for token refresh
          return authAPI
            .get("/api/v1/user/reissue", {
              headers: { refreshToken: `Bearer ${tokenData.refreshToken}` },
            })
            .then((res) => {
              const newTokenData = {
                accessToken: res.headers.accesstoken,
                refreshToken: tokenData.refreshToken,
              };
              sessionStorage.setItem("token", JSON.stringify(newTokenData));

              originalRequest.headers["accessToken"] =
                "Bearer " + newTokenData.accessToken;

              // Retry the original request
              return api(originalRequest);
            });
        } else if (error.response.data.message === "refresh token expired") {
          sessionStorage.clear();
          navigate("/login");
          window.alert("토큰이 만료되어 자동으로 로그아웃 되었습니다.");
        } else if (error.response.data.message === "mail token expired") {
          window.alert(
            "비밀번호 변경 시간이 만료되었습니다. 다시 요청해주세요."
          );
        } else if ([404, 409].includes(error.response.status)) {
          window.alert("이거니 404, 409", error.response.data.message);
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component is unmounted
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return null;
}
