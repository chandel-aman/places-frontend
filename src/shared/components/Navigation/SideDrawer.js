import React from "react";
import ReactDOM from "react-dom";

import { CSSTransition } from "react-transition-group";

import classes from "./SideDrawer.module.css";

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={0}
      classNames="slide-in-left-enter"
      mountOnEnter
      unmountOnExit
    >
      <aside className={classes["side-drawer"]} onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
