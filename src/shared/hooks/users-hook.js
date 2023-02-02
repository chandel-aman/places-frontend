import { useState, useEffect, useContext } from "react";

import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";

export const useUserData = (props) => {
  const authCtx = useContext(AuthContext);

  const [users, setUsers] = useState();
  const [currentUser, setCurrentUser] = useState();

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+"/users"
        );
        setUsers(responseData.users);
        const currentUser = responseData.users.filter(
          (user) => user.id === authCtx.userId
        );
        setCurrentUser(currentUser);
      } catch (error) {}
    };
    fetchUsers();
  }, [authCtx.userId, sendRequest]);

  return { users, currentUser, isLoading, error, clearError };
};
