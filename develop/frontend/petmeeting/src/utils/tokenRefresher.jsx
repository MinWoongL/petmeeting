// utils/tokenRefresher.js
import { refreshAccessToken } from "../service/TokenService";

let refreshing = false;
let refreshPromiseQueue = [];

function onTokenRefreshed(token) {
  refreshPromiseQueue.forEach((resolve) => resolve(token));
  refreshPromiseQueue = [];
}

export async function getAccessToken(refreshToken) {
  if (!refreshing) {
    refreshing = true;
    try {
      const newAccessToken = await refreshAccessToken(refreshToken);
      onTokenRefreshed(newAccessToken);
    } catch (error) {
      // Handle token refresh error
    } finally {
      refreshing = false;
    }
  }

  if (!refreshing) {
    return refreshToken; // Return the existing token if refresh fails
  }

  return new Promise((resolve) => {
    refreshPromiseQueue.push(resolve);
  });
}
