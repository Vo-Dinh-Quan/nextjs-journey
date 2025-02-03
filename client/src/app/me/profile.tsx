"use client";

import accountApiRequests from "@/apiRequests/account";
import { useAppContext } from "@/app/app-provider";
// import envConfig from "@/config";
import React, { useEffect } from "react";

export default function Profile() {
   const { sessionToken } = useAppContext();
   useEffect(() => {
      const fetchRequest = async () => {
         const response = await accountApiRequests.me(sessionToken);
         console.log(response);
      };
      fetchRequest();

   }, [sessionToken]);
   return <div></div>;
}
