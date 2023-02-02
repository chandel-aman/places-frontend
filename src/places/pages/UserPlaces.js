import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = (props) => {
  const navigate = useNavigate();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+`/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {
      }
    };
    fetchUserPlaces();
  }, [sendRequest, userId, navigate]);

  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };
  
  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedPlaces && (
        <PlaceList onDeletePlace={deletePlaceHandler} items={loadedPlaces} userId={userId}/>
      )}
    </>
  );
};

export default UserPlaces;
