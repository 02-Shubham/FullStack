import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getMeRequest, loginRequest, registerRequest } from '../api/auth.js';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../api/storage.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredAuth()?.user || null);
  const [token, setToken] = useState(() => getStoredAuth()?.token || null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(getStoredAuth()?.token));

  useEffect(() => {
    const refreshUser = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await getMeRequest();
        setUser(currentUser);
        setStoredAuth({ user: currentUser, token });
      } catch {
        setUser(null);
        setToken(null);
        clearStoredAuth();
      } finally {
        setIsBootstrapping(false);
      }
    };

    refreshUser();
  }, [token]);

  const applyAuth = (authData) => {
    setUser(authData.user);
    setToken(authData.token);
    setStoredAuth(authData);
  };

  const login = async (payload) => {
    const authData = await loginRequest(payload);
    applyAuth(authData);
    toast.success('Welcome back');
  };

  const register = async (payload) => {
    const authData = await registerRequest(payload);
    applyAuth(authData);
    toast.success('Account created');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearStoredAuth();
    toast.success('Logged out');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, token, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
