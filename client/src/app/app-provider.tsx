"use client";
import { createContext, useState, useContext } from "react";

const AppContext = createContext({
   sessionToken: "",
   setSessionToken: (sessionToken: string) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
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
   initialSessionToken = "",
}: {
   children: React.ReactNode;
   initialSessionToken: string;
}) {
   const [sessionToken, setSessionToken] = useState(initialSessionToken);

   return (
      <AppContext.Provider value={{ sessionToken, setSessionToken }}>
         {children}
      </AppContext.Provider>
   );
}
