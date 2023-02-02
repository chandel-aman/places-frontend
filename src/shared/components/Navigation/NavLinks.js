import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import classes from "./NavLinks.module.css";
import UserMenu from "./user-menu/UserMenu";

const NavLinks = () => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className={classes["nav-links"]}>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
        >
          ALL USERS
        </NavLink>
      </li>
      {authCtx.isLoggedIn && (
        <li>
          <NavLink
            to={'/'+authCtx.userId+'/places'}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            MY PLACES
          </NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <NavLink
            to="/places/new"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            ADD PLACE
          </NavLink>
        </li>
      )}
      {!authCtx.isLoggedIn && (
        <li>
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            LOGIN
          </NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          {/* <button onClick={authCtx.logout}>LOGOUT</button> */}
          <UserMenu className={classes.profile}/>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
