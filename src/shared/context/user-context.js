import { useState, useEffect, createContext } from "react";

import { useHttpClient } from "../hooks/http-hook";

export const UserContext = createContext({
  userData: null,
});

const UserInfo = (props) => {
  const [userData, setUserData] = useState();

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+"/users"
        );
        setUserData(responseData.users);
      } catch (error) {}
    };
    fetchUsers();
  },[]);
};
