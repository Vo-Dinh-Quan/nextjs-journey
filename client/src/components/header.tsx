import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import React from "react";
import { cookies } from 'next/headers'
import accountApiRequests from "@/apiRequests/account";

export default async function header() {
   const cookieStore = await cookies();
   const sessionToken = cookieStore.get('sessionToken')?.value ?? ''; // cú pháp ?? nghĩa là nếu cookieStore.get('sessionToken')?.value không có giá trị thì sessionToken sẽ bằng chuỗi rỗng
   let user = null;
   if (sessionToken) {
      const data = await accountApiRequests.me(sessionToken);
      user = data.payload.data;
   }
   console.log(user);
   return (
      <div>
         <ul className="flex justify-center gap-10 my-10">
            {user ? (
               <>
                  <li>
                     <span>Xin chào <strong>{user.name}</strong></span>
                  </li>
                  <ButtonLogout />
               </>
            ): (
               <>
                  <li>
                     <Link href="/login">Đăng nhập</Link>
                  </li>
                  <li>
                     <ModeToggle />
                  </li>
                  <li>
                     <Link href="/register">Đăng ký</Link>
                  </li>
               </>
            )}

            <li>
               <Link href="/products">Sản phẩm</Link>
            </li>
            <li>
               <Link href="/products/add">Thêm sản phẩm</Link>
            </li>
         </ul>
      </div>
   );
}
