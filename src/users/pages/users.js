import React, { useState, useEffect } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useUserData } from "../../shared/hooks/users-hook";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();
  const { error, isLoading, clearError } = useHttpClient();
  const { users } = useUserData();

  useEffect(() => {
    if (users) {
      setLoadedUsers(users);
    }
  }, [users]);

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
