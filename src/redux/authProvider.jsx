/* eslint-disable react/prop-types */
import  { createContext, useContext, useReducer } from "react";
import  authReducer  from "./authReducer";
const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
