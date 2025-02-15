"use client";

import authApiRequest from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Logout() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const sessionToken = searchParams.get("sessionToken");
   useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      if (sessionToken === clientSessionToken.value) {
         // console.log(clientSessionToken.value);
         authApiRequest
            .logoutFromNextClientToNextServer(true, signal)
            .then((res) => {
               router.push(`/login?redirectFrom=${pathname}`);
               // redirectFrom dành cho ai muốn cầu toàn, khi qua trang login thì sẽ biết được trang trước đó là trang nào, giả sử trang trước đó là trang /account thì khi qua trang login sẽ là /login?redirectFrom=/account và nếu có chúng ta sẽ hiện thông báo là buộc đăng xuất thành công
            });
      }
      return () => {
         // cleanup function là gì? cleanup function là một hàm mà chúng ta sẽ thực thi khi component bị unmount
         // (component bị unmount khi component đó không còn nằm trong cây DOM nữa, thường xảy ra khi chúng ta chuyển qua trang khác)
         // cleanup function thường được sử dụng để xóa các event listener, hủy các timer, hủy các fetch request, hủy các subscription, ...
         // ở đây chúng ta sẽ hủy fetch request khi component bị unmount
         controller.abort();
         console.log("cleanup");
      };
   }, [sessionToken, router, pathname]);
   return <div></div>;
}
