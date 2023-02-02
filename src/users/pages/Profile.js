import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

import { useUserData } from "../../shared/hooks/users-hook";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import classes from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [user, setUser] = useState({ name: "", image: "" });
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  const filePickerRef = useRef();

  const { currentUser } = useUserData();

  const [formState, inputHandler] = useForm({
    image: {
      value: null,
      isValid: false,
    },
  });

  useEffect(() => {
    if (currentUser)
      setUser({ name: currentUser[0].name, image: currentUser[0].image });
  }, [currentUser]);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      setPreviewUrl(undefined);
      fileIsValid = false;
    }
    inputHandler("image", pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const updateImage = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/users/${authCtx.userId}/profileUpdate`,
        "PATCH",
        formData,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      setPreviewUrl(undefined);
      navigate(`${authCtx.userId}/profile`);
    } catch (err) {
      console.log(err);
    }
  };

  //deleting the current profile picture
  const deleteProfilePicHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/users/${authCtx.userId}/profileImageDelete`,
        "PATCH",
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      navigate(`${authCtx.userId}/profile`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal error={error} onClear={clearError} />}
      {user.image && user.name && <div className={classes["user-profile"]}>
        <form onSubmit={updateImage}>
          <input
            id="image"
            ref={filePickerRef}
            style={{ display: "none" }}
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={pickedHandler}
          />
          <div className={classes["user-picture"]} onClick={pickImageHandler}>
            <img
              src={
                previewUrl ? previewUrl : `http://localhost:5000/${user.image}`
              }
              alt="user profile"
            />
            <div className={classes["image-overlay"]}>
              <FontAwesomeIcon icon={icon({ name: "image", style: "solid" })} />
              <p>CHANGE THE PROFILE PICTURE</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={!formState.isValid}
            className={!formState.isValid ? classes.invalid : ""}
          >
            CHANGE
          </button>
        </form>
        <button className={classes.remove} onClick={deleteProfilePicHandler}>REMOVE</button>
        <div className={classes["user-information"]}>
          <div>
            <b>Name: {user.name}</b>
          </div>
        </div>
      </div>}
    </>
  );
};

export default Profile;
