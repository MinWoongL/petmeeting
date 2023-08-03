import { useEffect } from "react";
import axios from "axios";
import { config } from "../static/config";
import { useNavigate } from "react-router-dom";

export default function TokenRefresher() {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAPI = axios.create({
      baseURL: `${config.baseURL}`,
      headers: { "Content-type": "application/json" },
    });

    const interceptor = axios.interceptors.response.use(
      function (response) {
        // If the request succeeds, just return the response
        return response;
      },
      async function (error) {
        const originalRequest = error.config;

        if (sessionStorage.getItem("token") && error.response.status === 400) {
          console.log("또또 여기 돌고있지");

          const tokenData = JSON.parse(sessionStorage.getItem("token"));
          return axios({
            url: `${config.baseURL}/api/v1/user/reissue`,
            method: "Get",
            headers: {
              refreshToken: `Bearer ${tokenData.refreshToken}`,
            },
          }).then((res) => {
            const newTokenData = {
              accessToken: res.headers.accesstoken,
              refreshToken: tokenData.refreshToken,
            };
            sessionStorage.setItem("token", JSON.stringify(newTokenData));

            originalRequest.headers["accessToken"] =
              "Bearer " + newTokenData.accessToken;

            // Retry the original request
            return refreshAPI(originalRequest);
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
          window.alert("이거니", error.response.data.message);
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component is unmounted
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return null;
}
