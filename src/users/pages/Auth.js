import React, { useContext, useState } from "react";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import classes from "./Auth.module.css";

const Auth = (props) => {

  const [isLoginMode, setLoginMode] = useState(true);

  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  const authCtx = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: true,
      },
      password: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  const switchHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setLoginMode((prevMode) => !prevMode);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    //sending data to the backend
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+"/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        authCtx.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+"/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.username.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        authCtx.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={submitHandler} className="center">
        {isLoading && <LoadingSpinner />}
        <div className={classes["login-container"]}>
          {/* <div className={classes.logo}></div> */}
          <div className={classes.title}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </div>
          {/* <div className={classes["sub-title"]}></div> */}
          <div className={classes.fields}>
            {!isLoginMode && (
              <div className={classes.username}>
                <Input
                  id="username"
                  element="input"
                  type="username"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid username."
                  onInput={inputHandler}
                  className="user-input"
                  placeholder="username"
                  signup
                />
              </div>
            )}
            <div className={classes.username}>
              <Input
                id="email"
                element="input"
                type="email"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email."
                onInput={inputHandler}
                className="user-input"
                placeholder="email"
                login
              />
            </div>
            <div className={classes.password}>
              <Input
                id="password"
                element="input"
                type="password"
                validators={[VALIDATOR_MINLENGTH(8)]}
                errorText="Please enter a valid password, atleast 8 characters long."
                onInput={inputHandler}
                className="pass-input"
                placeholder="password"
                login
              />
            </div>
          </div>
          <button
            className={`${classes["signin-button"]} ${
              !formState.isValid ? classes.invalid : classes.valid
            }`}
            type="submit"
            disabled={!formState.isValid}
          >
            {!isLoginMode ? "Sign Up" : "Login"}
          </button>
          <div className={classes.link}>
            {isLoginMode && (
              <>
                <a href="#">Forgot password?</a>
              </>
            )}
            <p>{isLoginMode ? "Create an account?" : "Have an account?"}</p>
            <span onClick={switchHandler}>
              {isLoginMode ? "Sign Up" : "Login"}
            </span>
          </div>
        </div>
      </form>
    </>
  );
};

export default Auth;
