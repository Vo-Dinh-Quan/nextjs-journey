"use client";
import authApiRequest from "@/apiRequests/auth";
import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ButtonLogout() {
   const router = useRouter();
   const pathname = usePathname();
   const handleLogout = async () => {
      try {
         await authApiRequest.logoutFromNextClientToNextServer();
         router.push("/login");
      } catch (error) {
         handleErrorApi({ error });
         authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
            router.push(`/login?redirectFrom=${pathname}`);
            // redirectFrom dành cho ai muốn cầu toàn, khi qua trang login thì sẽ biết được trang trước đó là trang nào, giả sử trang trước đó là trang /account thì khi qua trang login sẽ là /login?redirectFrom=/account và nếu có chúng ta sẽ hiện thông báo là buộc đăng xuất thành công
         });
      }
   };
   return (
      <div>
         <Button size={"sm"} onClick={handleLogout}>
            Đăng xuất
         </Button>
      </div>
   );
}
