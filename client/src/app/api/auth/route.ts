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
   console.log(res);
   return Response.json(res, {
      status: 200,
      headers: {
         "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly`,
      },
      // đặt httponly để javascript (client) không thể đọc được cookie
   });
}
