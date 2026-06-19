import { createContext, useEffect, useState } from "react";
import axios from "axios";
//StoreContext.js
export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");

  

  const contextValue = {
    token,
    setToken,
  };



  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
