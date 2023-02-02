import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../../context/auth-context";

import classes from "./Dashboard.module.css";

const Dashboard = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <ul className={classes.menu}>
        <li onClick={props.closeMenu}>
          <NavLink to={`${authCtx.userId}/profile`}>
            <ion-icon name="person-outline" />
            My Profile
          </NavLink>
        </li>
        <li onClick={props.closeMenu}>
        <NavLink to={`${authCtx.userId}/saved-places`}>
          <ion-icon name="bookmarks-outline"></ion-icon>
            Saved Places
            </NavLink>
        </li>
        {/* <li onClick={props.closeMenu}>
          <a href="/">
            <ion-icon name="notifications-outline" />
            Notifications
          </a>
        </li> */}
        <li onClick={props.closeMenu}>
          <NavLink to={`${authCtx.userId}/settings`} >
            <ion-icon name="settings-outline" />
            Settings
          </NavLink>
        </li>
        {/* <li onClick={props.closeMenu}>
          <a href="/">
            <ion-icon name="information-circle-outline" />
            Help & Support
          </a>
        </li> */}
        <li onClick={authCtx.logout}>
          <NavLink to="/">
            <ion-icon name="log-out-outline" />
            Logout
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default Dashboard;
