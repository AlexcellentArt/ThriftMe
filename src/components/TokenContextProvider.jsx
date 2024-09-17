import React, { useState } from 'react';
import { TokenContext } from './TokenContext';
export function TokenContextProvider({ children }) {
  const [token, setToken] = useState(null);
  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
}
export default TokenContextProvider