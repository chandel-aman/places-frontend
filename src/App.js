import React, { Fragment, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import useAuth from "./shared/hooks/auth-hook";

import Users from "./users/pages/users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
// import AddPlace from "./places/pages/AddPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
// import Profile from "./users/pages/Profile";
// import SavedPlaces from "./users/pages/SavedPlaces";
// import Settings from "./users/pages/Settings";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

import { Provider } from "@lyket/react";

const AddPlace = React.lazy(() => import("./places/pages/AddPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));
const Profile = React.lazy(() => import("./users/pages/Profile"));
const SavedPlaces = React.lazy(() => import("./users/pages/SavedPlaces"));
const Settings = React.lazy(() => import("./users/pages/Settings"));

const App = () => {
  const { login, logout, userId, token } = useAuth();

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, userId, login, logout }}
    >
      <Provider
        apiKey="pt_ebc2286b27a9739ac99d3033109d6a"
        theme={{
          colors: {
            text: "violet",
            primary: "transparent",
          },
        }}
      >
        <MainNavigation />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Users />} />
              <Route path="/:userId/places" element={<UserPlaces />} />
              {token && (
                <Fragment>
                  <Route path="/places/new" element={<AddPlace />} />
                  <Route path="/places/:placeId" element={<UpdatePlace />} />
                  <Route path="/:userId/profile" element={<Profile />} />
                  <Route
                    path="/:userId/saved-places"
                    element={<SavedPlaces />}
                  />
                  <Route path="/:userId/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Fragment>
              )}
              {!token && (
                <Fragment>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<Navigate to="/auth" replace />} />
                </Fragment>
              )}
            </Routes>
          </Suspense>
        </main>
      </Provider>
    </AuthContext.Provider>
  );
};

export default App;
