import React, { Fragment, useContext, useState } from "react";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";

import classes from "./Settings.module.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Settings = () => {

  const authCtx = useContext(AuthContext);

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [clicked, setClicked] = useState(false);

  const deleteModalHandler = () => {
    setClicked((prevState) => !prevState);
  };

  //async function to delete the user from the database
  const deleteUserHandler = async () => {
    setClicked((prevState) => !prevState);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/users/${authCtx.userId}/deleteAccount`,
        "DELETE",
        JSON.stringify({
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );

      authCtx.logout();
    } catch (err) {
      console.log(err+"frontend/settings");
    }
  };

  return (
    <Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner />}
      <section className={classes.accountActions}>
        <div className={classes.accountActions__delete}>
          <p onClick={deleteModalHandler}>Delete Your Acount</p>
          {clicked && (
            <Modal
              show={clicked}
              onCancel={deleteModalHandler}
              header="Please enter your password to continue."
              footer={
                <Fragment>
                  <Button cancel onClick={deleteModalHandler}>
                    CANCEL
                  </Button>
                  <Button type="submit" proceed onClick={deleteUserHandler}>
                    DELETE
                  </Button>
                </Fragment>
              }
            >
              <div className={classes.input}>
                <Input
                  id="password"
                  element="input"
                  type="password"
                  validators={[VALIDATOR_MINLENGTH(8)]}
                  errorText="Please enter a valid password, atleast 8 characters long."
                  onInput={inputHandler}
                  placeholder="password"
                  login
                />
              </div>
            </Modal>
          )}
        </div>
      </section>
    </Fragment>
  );
};

export default Settings;
