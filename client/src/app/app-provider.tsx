"use client";
import { createContext, useState, useContext } from "react";

const AppContext = createContext({
   sessionToken: "",
   setSessionToken: (sessionToken: string) => {},
});

export const useAppContext = () => {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("useAppContext must be used within a AppProvider");
   }
   return context;
};

export default function AppProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   const [sessionToken, setSessionToken] = useState("");

   return (
      <AppContext.Provider value={{ sessionToken, setSessionToken }}>
         {children}
      </AppContext.Provider>
   );
}
