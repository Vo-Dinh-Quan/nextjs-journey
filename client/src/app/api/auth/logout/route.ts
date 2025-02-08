import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
   const res = await request.json();
   const force = res.force as boolean | undefined;
   // trong trường hợp sessionToken hết hạn, chúng ta cần logout người dùng ra khỏi hệ thống mà không cần sessionToken

   // câu lệnh này nghĩa là tạo biến force để kiểm tra logout ép buộc hay không và nó được ép kiểu về 1 là boolean true hoặc false và 2 là undefined (có nghĩa là chúng ta không truyền giá trị)
   const cookieStore = cookies();
   const sessionToken = cookieStore.get("sessionToken");
   if (force) {
      // nếu mà thằng client truyền lên force: true thì chúng ta sẽ logout người dùng ra khỏi hệ thống mà không cần sessionToken
      return Response.json({
         message: "Buộc đăng xuất thành công",
      },{
         status: 200,
         headers: {
            // Xóa cookie sessionToken
            "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
         },
      });
   }
   if (!sessionToken) {
      return Response.json(
         { message: "Không nhận được session token" },
         {
            status: 401,
         }
      );
   }
   try {
      const result = await authApiRequest.logoutFromNextServerToServer(
         sessionToken.value
      );
      return Response.json(result.payload, { // cú pháp của hàm Response.json() là Response.json(data, options) trong đó data là dữ liệu trả về và options là các tùy chọn
         status: 200,
         headers: {
            // Xóa cookie sessionToken
            "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
         },
      });
   } catch (error) {
      if (error instanceof HttpError) {
         return Response.json(error.payload, {
            status: error.status,
         });
      } else {
         return Response.json(
            {
               message: "Lỗi không xác định",
            },
            {
               status: 500,
            }
         );
      }
   }
}
