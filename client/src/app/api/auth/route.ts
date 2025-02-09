export const dynamic = "force-static";

export async function POST(request: Request) {
   const body = await request.json();
   const sessionToken = body.sessionToken as string; // vì sao chúng ta cần thay đổi chỗ này? vì chúng ta chỉ truyền lên nextjs một giá trị sessionToken, không phải một object chứa sessionToken
   const expiresAt = body.expiresAt as string;
   if (!sessionToken) {
      return Response.json(
         { message: "Không nhận được session token!" },
         { status: 401 }
      );
   }
   const expiresDate = new Date(expiresAt).toUTCString() // phân tích dòng code này: payload.exp là thời gian hết hạn của JWT, nhưng nó được tính bằng giây từ epoch time nên chúng ta cần nhân với 1000 để chuyển về mili giây, sau đó chúng ta chuyển về dạng chuỗi ngày tháng năm.
   // xem thêm ở 2 link này: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString
   //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

   return Response.json(body, {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure` // đoạn này có nghĩa là chúng ta sẽ set cookie sessionToken với giá trị là sessionToken, Path=/ nghĩa là cookie sẽ được gửi với mọi request, HttpOnly nghĩa là cookie chỉ được gửi với HTTP request, Expires là thời gian hết hạn của cookie, SameSite=Strict nghĩa là cookie chỉ được gửi với cùng domain, Secure nghĩa là cookie chỉ được gửi với HTTPS request
      },
      // đặt httponly để javascript (client) không thể đọc được cookie
   });
}
