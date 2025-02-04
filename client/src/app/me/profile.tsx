"use client";

import accountApiRequests from "@/apiRequests/account";
import React, { useEffect } from "react";

export default function Profile() {
   useEffect(() => {
      const fetchRequest = async () => {
         const response = await accountApiRequests.meClient();
         console.log(response);
      };
      fetchRequest();
   }, []);
   return <div>profile</div>;
}
