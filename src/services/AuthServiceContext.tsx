import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { hasAuthParams, IAuthService } from "./AuthService";


interface AuthState {
  isLoading: boolean;
  isAuthorized: boolean;
}

interface AuthContextInterface extends AuthState {
  authorizeRedirect: () => void;
  authService: IAuthService;
}


export const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider = (props: React.PropsWithChildren<{ authService: IAuthService }>) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthorized: props.authService.isAuthorized()
  });

  useEffect(() => {
    props.authService.onAuthorized.subscribe(() => setState({
      isLoading: false,
      isAuthorized: true
    }));
  }, []);

  const authorizeRedirect = () => {
    setState(state => ({ ...state, isLoading: true }));
    props.authService.authorizeRedirect();
  }

  return <AuthContext.Provider value={{
    ...state,
    authorizeRedirect,
    authService: props.authService,
  }}>
    {props.children}
  </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
