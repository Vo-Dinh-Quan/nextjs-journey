import { decodeJWT } from "@/lib/utils";

type PayloadJWT = {
   iat: number;
   exp: number;
   tokenType: string;
   userId: number;
};

/* đây là payload của JWT sau khi decode
{
  "userId": 9,
  "tokenType": "sessionToken",
  "iat": 1739018908,
  "exp": 1770554908
}
   các số như 1739018908 là số giây kể từ 1/1/1970 (epoch time)

*/
export const dynamic = "force-static";

export async function POST(request: Request) {
   const res = await request.json();
   const sessionToken = res.sessionToken as string; // vì sao chúng ta cần thay đổi chỗ này? vì chúng ta chỉ truyền lên nextjs một giá trị sessionToken, không phải một object chứa sessionToken
   if (!sessionToken) {
      return Response.json(
         { message: "Không nhận được session token!" },
         { status: 401 }
      );
   }
   const payload = decodeJWT<PayloadJWT>(sessionToken)
   const expiresDate = new Date(payload.exp * 1000).toUTCString() // phân tích dòng code này: payload.exp là thời gian hết hạn của JWT, nhưng nó được tính bằng giây từ epoch time nên chúng ta cần nhân với 1000 để chuyển về mili giây, sau đó chúng ta chuyển về dạng chuỗi ngày tháng năm.
   // xem thêm ở 2 link này: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString
   //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

   return Response.json(res, {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure` // đoạn này có nghĩa là chúng ta sẽ set cookie sessionToken với giá trị là sessionToken, Path=/ nghĩa là cookie sẽ được gửi với mọi request, HttpOnly nghĩa là cookie chỉ được gửi với HTTP request, Expires là thời gian hết hạn của cookie, SameSite=Strict nghĩa là cookie chỉ được gửi với cùng domain, Secure nghĩa là cookie chỉ được gửi với HTTPS request
      },
      // đặt httponly để javascript (client) không thể đọc được cookie
   });
}
