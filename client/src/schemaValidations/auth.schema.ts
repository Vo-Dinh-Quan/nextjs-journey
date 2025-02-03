// Import thư viện Zod
import { z } from 'zod';

// Định nghĩa schema RegisterBody để xác thực dữ liệu đầu vào cho form đăng ký
export const RegisterBody = z
   .object({
      // Trường 'name' đại diện cho tên người dùng
      // - Loại bỏ khoảng trắng ở đầu và cuối chuỗi với `.trim()`
      // - Đảm bảo chuỗi có ít nhất 2 ký tự với `.min(2)`
      // - Đảm bảo chuỗi không vượt quá 256 ký tự với `.max(256)`
      name: z.string().trim().min(2).max(256),

      // Trường 'email' đại diện cho email người dùng
      // - Kiểm tra chuỗi có định dạng email hợp lệ với `.email()`
      email: z.string().email(),

      // Trường 'password' đại diện cho mật khẩu
      // - Đảm bảo mật khẩu có ít nhất 6 ký tự với `.min(6)`
      // - Đảm bảo mật khẩu không vượt quá 100 ký tự với `.max(100)`
      password: z.string().min(6).max(100),

      // Trường 'confirmPassword' đại diện cho việc xác nhận mật khẩu
      // - Các quy định giống như mật khẩu: từ 6 đến 100 ký tự
      confirmPassword: z.string().min(6).max(100),
   })
   .strict() // Đảm bảo không có trường nào khác ngoài các trường được định nghĩa trong schema
   .superRefine(({ confirmPassword, password }, ctx) => {
      // superRefine được sử dụng để tùy chỉnh logic xác thực phức tạp
      // Kiểm tra nếu 'confirmPassword' không khớp với 'password'
      if (confirmPassword !== password) {
         // Thêm lỗi tùy chỉnh vào context nếu mật khẩu không khớp
         ctx.addIssue({
            code: "custom", // Mã lỗi tùy chỉnh
            message: "Mật khẩu không khớp", // Thông báo lỗi
            path: ["confirmPassword"], // Xác định lỗi xảy ra tại trường 'confirmPassword'
         });
      }
   });

// Trích xuất kiểu dữ liệu TypeScript từ schema RegisterBody
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>; // tôi chưa hiểu cú pháp này 
// cú pháp z.TypeOf<typeof RegisterBody> có nghĩa là: Trích xuất kiểu dữ liệu từ schema RegisterBody

// Định nghĩa schema RegisterRes để xác thực dữ liệu phản hồi sau khi đăng ký 
export const RegisterRes = z.object({
   // Trường 'data' chứa thông tin phản hồi
   data: z.object({
      token: z.string(), // Token xác thực dưới dạng chuỗi
      expiresAt: z.string(), // Thời gian hết hạn của token dưới dạng chuỗi
      account: z.object({
         id: z.number(), // ID tài khoản (số)
         name: z.string(), // Tên người dùng (chuỗi)
         email: z.string(), // Email người dùng (chuỗi)
      }),
   }),
   message: z.string(), // Thông báo từ server (chuỗi)
});

// Trích xuất kiểu dữ liệu TypeScript từ schema RegisterRes
export type RegisterResType = z.TypeOf<typeof RegisterRes>;

// Định nghĩa schema LoginBody để xác thực dữ liệu đầu vào cho form đăng nhập
export const LoginBody = z
   .object({
      email: z.string().email(), // Trường 'email' phải là email hợp lệ
      password: z.string().min(6).max(100), // Trường 'password' phải từ 6 đến 100 ký tự
   })
   .strict(); // Đảm bảo không có trường nào ngoài những trường được định nghĩa

// Trích xuất kiểu dữ liệu TypeScript từ schema LoginBody
export type LoginBodyType = z.TypeOf<typeof LoginBody>;

// Định nghĩa schema LoginRes sử dụng lại schema RegisterRes
// Vì phản hồi sau khi đăng nhập và đăng ký có cấu trúc tương tự nhau
export const LoginRes = RegisterRes;

// Trích xuất kiểu dữ liệu TypeScript từ schema LoginRes
export type LoginResType = z.TypeOf<typeof LoginRes>;

// Định nghĩa schema SlideSessionBody để xác thực dữ liệu đầu vào cho một session
export const SlideSessionBody = z.object({}).strict();
// Đây là một object trống, không chấp nhận thêm bất kỳ trường nào

// Trích xuất kiểu dữ liệu TypeScript từ schema SlideSessionBody
export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;

// Định nghĩa schema SlideSessionRes sử dụng lại schema RegisterRes
// Vì phản hồi của session cũng có cấu trúc tương tự phản hồi đăng ký
export const SlideSessionRes = RegisterRes;

// Trích xuất kiểu dữ liệu TypeScript từ schema SlideSessionRes
export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;

/*
Giải thích thêm:
1. `RegisterRes` và `LoginRes`:
   - Dữ liệu phản hồi từ server có cấu trúc giống nhau, vì vậy có thể tái sử dụng schema `RegisterRes` cho `LoginRes`.

2. `SlideSessionBody`:
   - Đây là một object trống (không chứa trường nào), sử dụng `.strict()` để không chấp nhận bất kỳ trường nào không được định nghĩa.

3. `z.TypeOf<>`:
   - Trích xuất kiểu dữ liệu TypeScript từ schema Zod tương ứng.
   - Giúp đồng bộ giữa xác thực dữ liệu và kiểu dữ liệu trong TypeScript, tránh việc phải định nghĩa lại cấu trúc thủ công.
*/
