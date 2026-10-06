const TOKEN_KEY = 'rentify_auth_token';
const USER_KEY = 'rentify_user_data';

export const storage = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
