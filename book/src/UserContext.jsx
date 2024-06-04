import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
   const [ready,setReady]=useState(false)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setReady(true)
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
