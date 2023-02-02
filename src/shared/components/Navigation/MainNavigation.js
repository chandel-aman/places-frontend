import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerOpen(false);
  };
  
  return (
    <>
      {isDrawerOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
        <nav className={classes["main-navigation__drawer-nav"]}>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className={classes["main-navigation__menu-btn"]}
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className={classes["main-navigation__title"]}>
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className={classes["main-navigation__header-nav"]}>
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
