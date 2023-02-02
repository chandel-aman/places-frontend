import { useState, useEffect, useCallback } from "react";
import {useNavigate} from 'react-router-dom';

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationTime, setTokenExpirationTime] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    navigate(`/${uid}/places`);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationTime(expirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  //logout function
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationTime(null);
    localStorage.removeItem("userData");
    navigate("/auth");
  }, []);

  //to auto logout the user after the token expires
  useEffect(() => {
    if (token && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationTime]);

  //to store the user data and auto login the user
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};

export default useAuth;