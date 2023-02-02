import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { useUserData } from "../../../hooks/users-hook";

// import img from "./fav.png";
import Dashboard from "./Dashboard";
import Backdrop from "../../UIElements/Backdrop";
import ErrorModal from "../../UIElements/ErrorModal";
import LoadingSpinner from "../../UIElements/LoadingSpinner";

import classes from "./UserMenu.module.css";

const UserMenu = () => {

  const [clicked, setClicked] = useState(false);

  const [userInfo, setUserData] = useState({ userName: "", userImage: "" });

  const { currentUser, isLoading, error, clearError } = useUserData();

  useEffect(() => {
    if (currentUser) {
      setUserData({
        userName: currentUser[0].name,
        userImage: currentUser[0].image,
      });
    }
  }, [currentUser]);

  const menuToggleHandler = () => {
    setClicked(!clicked);
  };

  const content = (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && clicked && (
        <Backdrop
          onClick={menuToggleHandler}
          style={{ background: "transparent" }}
        />
      )}
      {!isLoading && !error && userInfo.userImage && (
        <div
          className={`${classes.navigation} ${clicked ? classes.active : ""}`}
        >
          <div className={classes.userBox}>
            <div className={classes.imgBox} onClick={menuToggleHandler}>
              <img
                src={process.env.REACT_APP_WEB_URL+`/${userInfo.userImage}`}
                alt="user profile"
              />
            </div>
            <p className={classes.username}>{userInfo.userName}</p>
          </div>
          <Dashboard closeMenu={menuToggleHandler} />
        </div>
      )}
    </>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

export default UserMenu;
