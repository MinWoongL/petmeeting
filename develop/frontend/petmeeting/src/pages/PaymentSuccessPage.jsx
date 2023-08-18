import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = JSON.parse(sessionStorage.getItem("token"));

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pgToken = urlParams.get("pg_token");
    const tid = window.localStorage.getItem("tid"); // localStorage에서 tid 추출

    if (pgToken && tid) {
      axios({
        method: "post",
        url: "https://i9a203.p.ssafy.io/backapi/api/v1/charge/check",
        headers: {
          "Content-Type": "application/json",
          AccessToken: `Bearer ${token.accessToken}`, // AccessToken 헤더 추가
        },
        data: JSON.stringify({
          tid,
          pgToken, // 이름이 pgToken인 프로퍼티로 전송
        }),
      })
        .then((response) => {
          console.log("결제후 response: ",response);
          // 성공적인 응답 처리 후 /mypage로 리디렉션
          navigate("/mypage");
        })
        .catch((error) => {
          // 에러 처리
          console.error("Payment processing failed:", error);
        });
    } else {
      // 에러 처리
      console.error("Payment failed. No pgToken or tid found.");
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Payment Processing...</h2>
    </div>
  );
};

export default PaymentSuccess;
