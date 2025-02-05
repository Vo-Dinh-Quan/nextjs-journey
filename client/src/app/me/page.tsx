import React from "react";
import { cookies } from "next/headers";
import Profile from "@/app/me/profile";
import accountApiRequests from "@/apiRequests/account";

const MeProfile = async () => {
   const cookieStore = await cookies();
   const sessionToken = cookieStore.get("sessionToken");

   const response = await accountApiRequests.me(sessionToken?.value ?? '');

   return (
      <div className="px-40">
         <div>
            <h1>Profile server</h1>
            <h1>Xin chào {response.payload.data?.name}</h1>
         </div>
         <Profile />
      </div>   
   );
};

export default MeProfile;
