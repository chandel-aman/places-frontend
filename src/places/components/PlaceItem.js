import React, { useState, Fragment, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { LikeButton } from "@lyket/react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import classes from "./PlaceItem.module.css";

const PlaceItem = (props) => {
  const authCtx = useContext(AuthContext);

  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfimModal] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showConfirmModalHandler = () => setShowConfimModal(true);
  const closeConfirmModalHandler = () => setShowConfimModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfimModal(false);

    //deleting from the database
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + authCtx.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const savePlaceHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/users/${authCtx.userId}/savePlace`,
        "POST",
        JSON.stringify({
          savedPlacePlaceId: props.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
    } catch (err) {}
  };

  //marked as saved
  let saved;
  if (authCtx.isLoggedIn && authCtx.userId !== props.creatorId) {
    saved = props.savedUser.find((uid) => uid === authCtx.userId);
  }

  return (
    <Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner />}
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <Button cancel onClick={closeMapHandler}>
            CLOSE
          </Button>
        }
      >
        <div className={classes["map-container"]}>
          <Map center={props.coordinates} zoom="10" />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={closeConfirmModalHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <Fragment>
            <Button cancel onClick={closeConfirmModalHandler}>
              CANCEL
            </Button>
            <Button proceed onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this? Please note that it can not be
          undone!
        </p>
      </Modal>
      <li className={classes["place-item"]}>
        <Card className={classes["place-item__content"]}>
          <div className={classes["place-item__image"]}>
            <img
              src={process.env.REACT_APP_WEB_URL+`/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className={classes["place-item__info"]}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className={classes["place-item__actions"]}>
            <div className={`${classes.icon} ${classes.likeButton}`}>
              <LikeButton
                namespace="like"
                id={`likeButton-${props.id}`}
                // onPress={likeButtonHandler}
              />
            </div>
            <FontAwesomeIcon
              onClick={openMapHandler}
              className={`${classes.icon} ${classes.map}`}
              icon={icon({ name: "map-location-dot", style: "solid" })}
            />

            {authCtx.userId === props.creatorId && (
              <>
                <Link to={`/places/${props.id}`}>
                  <FontAwesomeIcon
                    className={`${classes.icon} ${classes.edit}`}
                    icon={icon({ name: "pen-to-square", style: "solid" })}
                  />
                </Link>
                <FontAwesomeIcon
                  onClick={showConfirmModalHandler}
                  className={`${classes.icon} ${classes.delete}`}
                  icon={icon({ name: "trash", style: "solid" })}
                />
              </>
            )}

            {authCtx.isLoggedIn && authCtx.userId !== props.creatorId && (
              <FontAwesomeIcon
                onClick={savePlaceHandler}
                className={`${classes.icon} ${classes.savePlace} ${
                  saved ? classes.saved : ""
                }`}
                icon={icon({ name: "bookmark", style: "solid" })}
              />
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
