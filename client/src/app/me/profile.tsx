"use client";

import accountApiRequests from "@/apiRequests/account";
import React, { useEffect } from "react";
import { handleErrorApi } from "@/lib/utils";

export default function Profile() {
   useEffect(() => {
      const fetchRequest = async () => {
         try {
            const result = await accountApiRequests.meClient();
            console.log(result);
         } catch (error) {
            handleErrorApi({
               error,
            });
         }
      };
      fetchRequest();
   }, []);
   return <div>profile client</div>;
}
