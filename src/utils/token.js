// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAccessToken() {
  return localStorage.getItem('access-token') ? JSON.parse(localStorage.getItem('access-token')) : {};
}

export function setAccessToken(token = {}) {
  const tokenInfo = {
    ...token,
    clientCreateTime: new Date().getTime(),
  };
  return localStorage.setItem('access-token', JSON.stringify(tokenInfo));
}

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getUserInfo() {
  return JSON.parse(localStorage.getItem('user-info')) || {};
}

export function setUserInfo(userInfo) {
  return localStorage.setItem('user-info', JSON.stringify(userInfo));
}
