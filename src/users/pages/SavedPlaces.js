import React, { useEffect, useState } from "react";

import { useUserData } from "../../shared/hooks/users-hook";

import PlaceList from "../../places/components/PlaceList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const SavedPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { currentUser, isLoading, error, clearError } = useUserData();

  useEffect(() => {
    if (currentUser) {
      if (currentUser[0].savedPlaces) {
        setLoadedPlaces(currentUser[0].savedPlaces);
      }
    }
  }, [currentUser]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} savedPlaces />
      )}
    </>
  );
};

export default SavedPlaces;
