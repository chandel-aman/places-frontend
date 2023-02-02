import React from "react";
import { Link } from "react-router-dom";

import classes from "./UserItem.module.css";
import Avator from "../../shared/components/UIElements/Avator";
import Card from '../../shared/components/UIElements/Card';

const UserItem = (props) => {
  return (
    <li className={classes["user-item"]}>
      <Card className={classes["user-item__content"]}>
        <Link to={`/${props.id}/places`}>
          <div className={classes["user-item__image"]}>
            <Avator image={process.env.REACT_APP_WEB_URL+`/${props.image}`} alt={props.name} />
          </div>
          <div className={classes["user-item__info"]}>
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
