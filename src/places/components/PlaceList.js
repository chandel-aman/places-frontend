import React, { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";

import classes from "./PlaceList.module.css";

const PlaceList = (props) => {
  const authCtx = useContext(AuthContext);

  if (props.items.length === 0) {
    if (!props.savedPlaces) {
      return (
        <div className={`${classes["place-list"]} center`}>
          <Card>
            {authCtx.isLoggedIn && authCtx.userId === props.userId ? (
              <>
                <h2>No place found. Maybe create one?</h2>
                <Button to="/places/new">Add Place</Button>
              </>
            ) : (
              <h2>User does not has any place.</h2>
            )}
          </Card>
        </div>
      );
    } else {
      return (
        <div className={`${classes["place-list"]} center`}>
          <Card>
            <h2>No saved place found.</h2>
          </Card>
        </div>
      );
    }
  }

  return (
    <ul className={classes["place-list"]}>
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          title={place.title}
          image={place.image}
          description={place.description}
          address={place.address}
          coordinates={place.location}
          creatorId={place.creator}
          onDelete={props.onDeletePlace}
          savedUser={place.saved}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
