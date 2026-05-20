const AUTH_KEY = 'task_dashboard_auth';

export const getStoredAuth = () => {
  const rawAuth = sessionStorage.getItem(AUTH_KEY);

  if (!rawAuth) {
    return null;
  }

  try {
    return JSON.parse(rawAuth);
  } catch {
    clearStoredAuth();
    return null;
  }
};

export const setStoredAuth = (auth) => {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
  sessionStorage.removeItem(AUTH_KEY);
};

export const getStoredToken = () => getStoredAuth()?.token;
