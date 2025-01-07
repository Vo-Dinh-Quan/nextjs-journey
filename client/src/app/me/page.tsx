import envConfig from "@/config";
import React from "react";
import { cookies } from "next/headers";

const MeProfile = async () => {
   const cookieStore = await cookies();
   const sessionToken = cookieStore.get("sessionToken");

   console.log(sessionToken);

   const response = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
      {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken?.value}`,
         },
      }
   );
   const payload = await response.json();
   const data = {
      // Tạo object chứa thông tin kết quả
      status: response.status,
      payload,
   };

   if (!response.ok) {
      throw data;
   }
   console.log(data);
   return (
      <div className="px-40">
         <div>
            <h1>Profile</h1>
            <h1>Xin chào {data.payload.data?.name}</h1>
         </div>
      </div>
   );
};

export default MeProfile;
