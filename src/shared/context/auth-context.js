import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userName: '',
    userImage: null,
    userId: null,
    login: ()=>{},
    logout: ()=>{},
});