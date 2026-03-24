import { createContext, useContext, useMemo, useState } from "react";
import { loginUser } from "../services/api/UserApi";
import { refreshAccessToken } from "../services/api/AuthApi";

const AuthContext = createContext();

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_INFO_KEY = "userInfo";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem(ACCESS_TOKEN_KEY) || ""
  );

  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem(REFRESH_TOKEN_KEY) || ""
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_INFO_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!accessToken && !!refreshToken;

  const saveAuthData = (userData) => {
    const newAccessToken = userData?.accessToken || "";
    const newRefreshToken = userData?.refreshToken || "";

    const userInfo = {
      _id: userData?._id,
      full_name: userData?.full_name,
      username: userData?.username,
      role: userData?.role,
      email: userData?.email,
      status: userData?.status,
    };

    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setCurrentUser(userInfo);
  };

  const clearAuthData = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);

    setAccessToken("");
    setRefreshToken("");
    setCurrentUser(null);
  };

  const handleLogin = async (loginData) => {
    const data = await loginUser(loginData);

    if (data?.EC === 0 && data?.result?.accessToken && data?.result?.refreshToken) {
      saveAuthData(data.result);
    }

    return data;
  };

  const handleRefreshToken = async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!storedRefreshToken) {
      clearAuthData();
      return null;
    }

    const data = await refreshAccessToken(storedRefreshToken);

    if (data?.EC === 0 && data?.result) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.result);
      setAccessToken(data.result);
      return data.result;
    }

    clearAuthData();
    return null;
  };

  const handleLogout = () => {
    clearAuthData();
  };

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      currentUser,
      isAuthenticated,
      handleLogin,
      handleLogout,
      handleRefreshToken,
    }),
    [accessToken, refreshToken, currentUser, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);