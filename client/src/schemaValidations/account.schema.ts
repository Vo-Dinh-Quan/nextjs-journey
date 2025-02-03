// Import thư viện Zod
import { z } from "zod";

// Xác định schema cho phản hồi từ server
export const AccountRes = z
   .object({
      // Trường 'data' là một object chứa thông tin chi tiết về tài khoản
      data: z.object({
         id: z.number(), // Trường 'id' phải là một số (number)
         name: z.string(), // Trường 'name' phải là một chuỗi (string)
         email: z.string(), // Trường 'email' phải là một chuỗi (string)
      }),
      message: z.string(), // Trường 'message' phải là một chuỗi (string)
   })
   .strict(); // Sử dụng .strict() để đảm bảo không có trường nào ngoài các trường được định nghĩa

// Trích xuất kiểu dữ liệu TypeScript từ schema AccountRes
export type AccountResType = z.TypeOf<typeof AccountRes>;

// Schema để xác thực dữ liệu gửi lên server khi cập nhật thông tin cá nhân
export const UpdateMeBody = z.object({
   name: z
      .string() // Trường 'name' phải là một chuỗi (string)
      .trim() // Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
      .min(2, "Tên phải có ít nhất 2 ký tự") // Đặt tối thiểu 2 ký tự
      .max(256, "Tên không được dài hơn 256 ký tự"), // Đặt tối đa 256 ký tự
});

// Trích xuất kiểu dữ liệu TypeScript từ schema UpdateMeBody
export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
