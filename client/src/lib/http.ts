import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
   baseUrl?: string | undefined;
};
const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
   message: string;
   errors: {
      field: string;
      message: string;
   }[];
};

export class HttpError extends Error {
   status: number;
   payload: {
      message: string;
      [key: string]: any; // key có thể là bất kỳ kiểu dữ liệu nào (string, number, boolean, ...)
      //
   };
   constructor({ status, payload }: { status: number; payload: any }) {
      super("Http Error");
      this.status = status;
      this.payload = payload;
   }
}

export class EntityError extends HttpError {
   status: 422;
   payload: EntityErrorPayload;
   constructor({
      status,
      payload,
   }: {
      status: 422;
      payload: EntityErrorPayload;
   }) {
      super({ status, payload });
      this.status = status;
      this.payload = payload;
   }
}

class SessionToken {
   private token = "";
   private _expiresAt = new Date().toISOString(); // giá trị mặc định của expiresAt là ngày hiện tại

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
   get expiresAt() {
      return this._expiresAt;
   }
   set expiresAt(expiresAt: string) {
      // Nếu gọi method này ở server thì sẽ bị lỗi
      if (typeof window === "undefined") {
         throw new Error("Cannot set token on server side");
      }
      this._expiresAt = expiresAt;
   }
}
export const clientSessionToken = new SessionToken();
let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
   method: "GET" | "POST" | "PUT" | "DELETE",
   url: string,
   options?: CustomOptions | undefined
) => {
   const body = options?.body
      ? options.body instanceof FormData
         ? options.body
         : JSON.stringify(options.body)
      : undefined;
   // ở phần body chúng ta cần xử lý trong trường hợp body là FormData thì không cần chuyển về JSON string, còn nếu không phải FormData thì chuyển về JSON string

   // Formdata dùng cho việc upload hình ảnh và tập tin
   // Khi sử dụng FormData, chúng ta không cần phải set Content-Type: multipart/form-data trong headers vì nó sẽ tự động set Content-Type: multipart/form-data
   const baseHeaders =
      body instanceof FormData
         ? {
              Authorization: clientSessionToken.value
                 ? `Bearer ${clientSessionToken.value}`
                 : "",
           }
         : {
              "Content-Type": "application/json",
              Authorization: clientSessionToken.value // nếu clientSessionToken.value không có giá trị thì Authorization sẽ bằng chuỗi rỗng
                 ? `Bearer ${clientSessionToken.value}`
                 : "",
           };

   // cách mà GPT chỉ để không bị lỗi typescript ở header (anh Được giải quyết bằng cách thêm as any)
   /*
      if (body instanceof FormData) {
      // Không cần đặt Content-Type khi sử dụng FormData
      headers.append("Authorization", clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : "");
   } else {
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : "");
   }

   if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
         headers.append(key, value as string);
      });
   }

   const res = await fetch(fullUrl, {
      ...options,
      headers,
      body,
      method,
   });

   */
   const baseUrl =
      options?.baseUrl === undefined
         ? envConfig.NEXT_PUBLIC_API_ENDPOINT
         : options.baseUrl;
   const fullUrl = url.startsWith("/")
      ? `${baseUrl}${url}`
      : `${baseUrl}/${url}`;

   const res = await fetch(fullUrl, {
      ...options,
      headers: {
         ...baseHeaders,
         ...options?.headers,
      } as any, // chúng ta đang nói với Typescript rằng tôi biết rõ hơn nó về kiểu dữ liệu của headers, nó không cần phải kiểm tra kiểu dữ liệu của headers nữa
      body,
      method,
   });

   const payload: Response = await res.json();
   const data = {
      status: res.status,
      payload,
   };
   console.log(data);
   // Interceptor là nơi chúng ta xử lý response trước khi trả về cho component
   if (!res.ok) {
      if (res.status === ENTITY_ERROR_STATUS) {
         throw new EntityError(
            data as {
               status: 422;
               payload: EntityErrorPayload;
            }
         );
      } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
         // Nếu status code là 401, tức là sessionToken hết hạn hoặc không hợp lệ thì chúng ta sẽ logout người dùng ra khỏi hệ thống đối với client
         //
         if (typeof window !== "undefined") {
            // ta cần đảm bảo logic này chỉ chạy ở client vì cookie chỉ nằm ở next client nên khi xóa cookie thì chỉ xóa ở client
            //
            if (!clientLogoutRequest) {
               // biến clientLogoutRequest sẽ bằng null nếu chưa gán giá trị, nó có mục đích là để kiểm tra xem đã gọi fetch logout chưa để tránh việc gọi nhiều lần
               clientLogoutRequest = fetch("/api/auth/logout", {
                  method: "POST",
                  body: JSON.stringify({ force: true }),
                  headers: {
                     ...baseHeaders,
                  }as any,
               });
               await clientLogoutRequest;
               clientSessionToken.value = "";
               clientSessionToken.expiresAt = new Date().toISOString();
               // .toUTCString khác toUTCString ở chỗ nó sẽ chuyển về dạng chuỗi ngày tháng năm theo giờ UTC
               clientLogoutRequest = null;
               location.href = "/login";
            }
         } else {
            // cách mà chúng ta xử lý đối với server là cho nó chuyển sang 1 trang logout (client component) để xóa sessionToken và chuyển hướng về trang login
            // hiểu đơn giản ở đây là chúng ta sẽ làm qua 1 bước trung gian, chuyển hướng qua trong logout là môi trường client, sau đó call api '/api/auth/logout' đến next router để xóa cookie trong client và chuyển hướng về trang login
            const sessionToken = (
               options?.headers as any
            )?.Authorization?.split("Bearer ")[1]; // dòng lệnh này có nghĩa là lấy sessionToken từ headers của options và cắt chuỗi từ "Bearer " trở đi
            redirect(`/logout?sessionToken=${sessionToken}`);
            // đoạn logic này chúng ta chỉ đang chạy ở server trong 1 file chạy đa nền tảng, nếu chúng ta chạy ở client thì sẽ bị lỗi, theo tài liệu của nextjs thì redirect có thể chạy ở server component, route handler và server action
            // https://nextjs.org/docs/app/api-reference/functions/redirect

            // lý do mà chúng ta sử dụng thêm ?sessionToken=${sessionToken} là để chúng ta có thể lấy sessionToken từ query string của url trong trang logout tránh việc cứ khi truy cập vào url này thì nó sẽ tự động đăng xuất mà không cần sessionToken
         }
      } else {
         throw new HttpError(data);
      }
   }
   if (typeof window !== "undefined") {
      // Đảm bảo logic này chỉ chạy ở phía client (browser)
      if (
         ["auth/login", "auth/register"].some(
            (item) => item === normalizePath(url)
         )
      ) {
         // địt mẹ mày cái chỗ này làm tao mệt mỏi, đụ má /auth/login nên nó đéo vào cá if, nên k set được sessionToken. Tổ cha nhà nó cái chỗ này
         clientSessionToken.value = (payload as LoginResType).data.token;
         clientSessionToken.expiresAt = (
            payload as LoginResType
         ).data.expiresAt;
      } else if ("/auth/logout" === normalizePath(url)) {
         clientSessionToken.value = "";
         clientSessionToken.expiresAt = new Date().toISOString();
      }
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
      return request<Response>("POST", url, { ...options, body });
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
};
export default http;
