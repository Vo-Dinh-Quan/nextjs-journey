import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import React from "react";

export default function header() {
   return (
      <div>
         <ul className="flex justify-center gap-10 my-10">
            <li>
               <Link href="/login">Đăng nhập</Link>
            </li>
            <li>
               <ModeToggle />
            </li>
            <li>
               <Link href="/register">Đăng ký</Link>
            </li>
         </ul>
      </div>
   );
}
