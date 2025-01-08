"use client";

import { useAppContext } from "@/app/app-provider";
import envConfig from "@/config";
import React, { useEffect } from "react";

export default function Profile() {
   const { sessionToken } = useAppContext();
   useEffect(() => {
      const fetchRequest = async () => {
         const response = await fetch(
            `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
            {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionToken}`,
               },
            }
         );
         const payload = await response.json();
         const data = {
            // Tạo object chứa thông tin kết quả
            status: response.status,
            payload,
         };
         console.log("payload: ", payload);
         console.log("data: ", data);
      };
      fetchRequest();

   }, [sessionToken]);
   return <div></div>;
}
