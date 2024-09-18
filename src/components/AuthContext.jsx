import React, { useState, createContext } from 'react';
const AuthContext = createContext("AuthContext")
export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  function login(params) {
    // add in verification of user
    setToken(null)
    // for now, all users are admins, but this will be factored out later, as when fetching user here I can determine if they are an admin or not
    setIsAdmin(true)
  }
  function logout(params) {
    setToken(null)
    setIsAdmin(false)
  }
  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthContextProvider
export {AuthContext}