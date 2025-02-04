"use client";
import { clientSessionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
   children,
   initialSessionToken = "",
}: {
   children: React.ReactNode;
   initialSessionToken?: string;
}) {
   useState(() => { // chúng ta sử dụng useState thay vì useEffect hay useLayoutEffect vì nó được gọi ngay khi component được render, không cần phải đợi component được mount như useEffect hay useLayoutEffect
      if (typeof window !== "undefined") { // bởi vì sao ở đây chúng ta cần kiểm tra typeof window !== "undefined" thêm 1 lần nữa ? trong khi chúng ta đã kiểm tra ở file lib/http.ts rồi?

      // ở đây chúng ta kiểm tra typeof window !== "undefined" để đảm bảo rằng code này chỉ chạy trên client side, tránh việc chạy trên server side. vì khi build ứng dụng, code sẽ chạy trên cả client và server side, nếu không kiểm tra typeof window !== "undefined" thì code sẽ chạy cả 2 bên, dẫn đến lỗi. 
         clientSessionToken.value = initialSessionToken;
      }
   });

   return (
      <>
         {children}
      </>
   );
}
