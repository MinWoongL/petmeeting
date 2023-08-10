// services/tokenService.js
import axios from "axios";

import { config } from "../static/config";

export const tokenService = axios.create({
  baseURL: `${config.baseURL}`,
  headers: { "Content-type": "application/json" },
});

export function setAuthorizationHeader(token) {
  tokenService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAuthorizationHeader() {
  delete tokenService.defaults.headers.common["Authorization"];
}

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await tokenService.get("/api/v1/user/reissue", {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    const newAccessToken = response.headers.accesstoken;
    setAuthorizationHeader(newAccessToken);

    return newAccessToken;
  } catch (error) {
    throw error;
  }
}
