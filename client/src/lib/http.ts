import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

/**
RequestInit là một interface của TypeScript và được dùng với fetch API. Nó định nghĩa các options mà bạn có thể truyền vào fetch API như method, headers, body, mode, cache, redirect, referrerPolicy, integrity, keepalive, signal, window, baseUrl.

interface RequestInit {
   method?: string; // HTTP method (GET, POST, PUT, DELETE, ...)
   headers?: HeadersInit; // HTTP headers
   body?: BodyInit | null; // Nội dung gửi trong request
   mode?: RequestMode; // Mode của request (e.g., 'cors', 'no-cors', 'same-origin')
   credentials?: RequestCredentials; // Cookie có được gửi kèm không
   cache?: RequestCache; // Cách xử lý cache
   ...
}

Omit<RequestInit, "method"> là một type của TypeScript, nó sẽ loại bỏ thuộc tính method khỏi RequestInit. Ví dụ: Omit<{ a: string, b: number }, "a"> sẽ trả về { b: number }.
Omit<RequestInit, "method"> có nghĩa là: Loại bỏ thuộc tính method khỏi interface RequestInit.

CustomOptions là một type của TypeScript, nó sẽ loại bỏ thuộc tính method khỏi RequestInit và thêm một thuộc tính mới là baseUrl.

Dấu & trong TypeScript được dùng để kết hợp hai kiểu (type) với nhau. Ví dụ: type A = { a: string } & { b: number } sẽ trả về { a: string, b: number }.

& { baseUrl?: string | undefined } có nghĩa là: Thêm một thuộc tính mới là baseUrl vào CustomOptions. Thuộc tính này có thể có giá trị là string hoặc undefined.

Tại sao cần loại bỏ method khỏi RequestInit? Vì method sẽ được truyền vào hàm request, nếu không loại bỏ thì sẽ bị trùng lặp.
 */

type CustomOptions = Omit<RequestInit, "method"> & {
   baseUrl?: string | undefined;
   // thực chất chúng ta tạo ra thằng CustomOptions này để thêm một thuộc tính mới là baseUrl vào RequestInit
};
   
/**
1. Class HttpError là gì?
HttpError là một class tùy chỉnh kế thừa từ class mặc định Error của JavaScript. Nó giúp bạn tạo ra các đối tượng lỗi (error objects) với thông tin chi tiết hơn, như:

status: Mã trạng thái HTTP (HTTP status code) của lỗi, ví dụ: 404, 500...
payload: Dữ liệu chi tiết về lỗi, thường là thông báo lỗi từ API.

status: number: Lưu mã trạng thái HTTP của lỗi (ví dụ: 404, 500).
payload: any: Chứa dữ liệu chi tiết về lỗi, có thể là một object hoặc bất kỳ kiểu dữ liệu nào.

super("Http Error"):

Gọi đến constructor của class Error gốc.
"Http Error" là thông điệp mặc định của lỗi.
 */
class HttpError extends Error {
   status: number;
   payload: any;
   constructor({ status, payload }: { status: number; payload: any }) {
      super("Http Error");
      this.status = status;
      this.payload = payload;
   }
}

/*
Đoạn mã này định nghĩa một class SessionToken để quản lý token (thường dùng trong các ứng dụng web để xác thực).

SessionToken giúp quản lý một token phiên (session token), ví dụ như token dùng để xác thực người dùng. Nó bao gồm:
- Thuộc tính riêng tư (private): Đảm bảo token không bị truy cập hoặc sửa đổi trực tiếp từ bên ngoài.
- Getter và Setter: Cung cấp cách truy cập và thay đổi giá trị token một cách an toàn.
- Kiểm tra môi trường: Ngăn việc thay đổi token từ phía server.

2.1. Thuộc tính private token
private token = "";
private: Thuộc tính này chỉ có thể được truy cập hoặc sửa đổi bên trong class SessionToken. Điều này đảm bảo tính an toàn và ngăn thay đổi trái phép từ bên ngoài.


2.2. Getter value
get value() {
   return this.token;
}
Getter: Cung cấp cách đọc giá trị của token từ bên ngoài class.
Khi bạn gọi clientSessionToken.value, getter này sẽ trả về giá trị của token.


*/

class SessionToken {
   private token = "";
   get value() {
      return this.token;
   }
   set value(token: string) {
      // Nếu gọi method này ở server thì sẽ bị lỗi
      if (typeof window === "undefined") {
         throw new Error("Cannot set token on server side");
      }
      this.token = token;
   }
}
export const clientSessionToken = new SessionToken();


// Cấu trúc hàm request: <Response> ở đây là một generic type, nó cho phép định nghĩa kiểu dữ liệu của response trả về từ payload.
// vd: const data = await request<User>("GET", "/user"); Ở đây, Response sẽ được thay thế bằng kiểu dữ liệu User.
// method: Là phương thức HTTP (GET, POST, PUT, DELETE) mà bạn muốn sử dụng cho yêu cầu.
// url: Đường dẫn endpoint API mà bạn muốn gọi.
// options: Là các tùy chọn bổ sung (giống CustomOptions) như headers, body, baseUrl.
// Response là kiểu dữ liệu của payload trả về từ API. Nó được định nghĩa thông qua generic type <Response> là một kiểu dữ liệu bất kỳ. Ví dụ: User, Post, Comment...
const request = async <Response>(
   method: "GET" | "POST" | "PUT" | "DELETE",
   url: string,
   options?: CustomOptions | undefined
) => {
   // Tạo body: nếu options?.body tồn tại thì chuyển options.body thành chuỗi JSON, nếu không thì body = undefined.
   const body = options?.body ? JSON.stringify(options.body) : undefined;

   // Tạo baseHeaders: chứa các header cơ bản như Content-Type và Authorization.
   const baseHeaders = {
      "Content-Type": "application/json",
      Authorization: clientSessionToken.value
         ? `Bearer ${clientSessionToken.value}`
         : "",
   };
   // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
   // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
   const baseUrl =
      options?.baseUrl === undefined
         ? envConfig.NEXT_PUBLIC_API_ENDPOINT
         : options.baseUrl;
   const fullUrl = url.startsWith("/")
      ? `${baseUrl}${url}`
      : `${baseUrl}/${url}`;

   const res = await fetch(fullUrl, {
      ...options, // dấu ... ở đây là spread operator, nó sẽ trải các thuộc tính của options ra thành các thuộc tính riêng lẻ.
      headers: {
         ...baseHeaders,
         ...options?.headers, // dấu ... và ?. ở đây là optional chaining, nó sẽ kiểm tra xem options.headers có tồn tại không trước khi trải ra. nếu không tồn tại thì trả về undefined.
      },
      body,
      method,
   });

   const payload: Response = await res.json();
   const data = {
      status: res.status,
      payload,
   };
   if (!res.ok) {
      throw new HttpError(data);
   }
   if (["/auth/login", "/auth/register"].includes(url)) {
      clientSessionToken.value = (payload as LoginResType).data.token; // Tôi chưa hiểu dòng này lắm, hãy giải thích giúp tôi
      // Nếu url là /auth/login hoặc /auth/register thì lưu token vào clientSessionToken
      // payload as LoginResType: ép kiểu payload về LoginResType
      // (payload as LoginResType).data.token: lấy token từ payload
   } else if ("/auth/logout".includes(url)) {
      clientSessionToken.value = "";
   }
   return data;
};

const http = {
   get<Response>(
      url: string,
      options?: Omit<CustomOptions, "body"> | undefined // undefined ở đây là giá trị mặc định nếu không truyền vào options
   ) {
      return request<Response>("GET", url, options);
   },
   post<Response>(
      url: string,
      body: any,
      options?: Omit<CustomOptions, "body"> | undefined
   ) {
      return request<Response>("POST", url, { ...options, body }); // cú pháp request<Response>("POST", url, { ...options, body }) có nghĩa là gọi hàm request với method POST, url và options được truyền vào, thêm body vào options. 
      // Ví dụ: http.post<User>("/user", { name: "John" }) sẽ gọi hàm request với method POST, body là { name: "John" } và trả về kiểu dữ liệu User.
      // Cú pháp { ...options, body } sẽ trải ra các thuộc tính của options và thêm thuộc tính body vào.
      // Nhưng tại sao lại bỏ đi body trong options? Vì body đã được truyền vào hàm post, nếu không bỏ đi sẽ bị trùng lặp. nhưng tại sao lại thêm body: any vào hàm post? Để TypeScript biết body là một tham số bắt buộc.
   },
   put<Response>(
      url: string,
      body: any,
      options?: Omit<CustomOptions, "body"> | undefined
   ) {
      return request<Response>("PUT", url, { ...options, body });
   },
   delete<Response>(
      url: string,
      body: any,
      options?: Omit<CustomOptions, "body"> | undefined
   ) {
      return request<Response>("DELETE", url, { ...options, body });
   },
}; // Tôi chưa hiểu lắm về cú pháp định nghĩa http này, hãy giải thích giúp tôi
// Đây là cú pháp định nghĩa một object trong TypeScript, object này chứa các method get, post, put, delete.
// Mỗi method này sẽ gọi hàm request với method tương ứng (GET, POST, PUT, DELETE).
// Ví dụ: http.get<User>("/user") sẽ gọi hàm request với method GET và trả về kiểu dữ liệu User.
// Cú pháp { ...options, body } sẽ trải ra các thuộc tính của options và thêm thuộc tính body vào.
// Ví dụ: http.post<User>("/user", { name: "John" }) sẽ gọi hàm request với method POST, body là { name: "John" } và trả về kiểu dữ liệu User.
// Tóm lại, http là một object chứa các method get, post, put, delete để gọi API với các phương thức tương ứng.

export default http;
