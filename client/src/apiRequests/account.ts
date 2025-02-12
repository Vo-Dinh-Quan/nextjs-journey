import http from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const accountApiRequests = {
   me: (sessionToken: string) =>
      http.get<AccountResType>("account/me", {
         headers: {
            Authorization: `Bearer ${sessionToken}`,
         },
      }),
   meClient: () => http.get<AccountResType>("account/me"),
   // đoạn này là sao? tại sao lại có 2 hàm me và meClient?
   // me là hàm dành cho server, meClient là hàm dành cho client
   // meClient không cần truyền sessionToken vì nó sẽ lấy sessionToken từ clientSessionToken
   // me cần truyền sessionToken vì nó sẽ lấy sessionToken từ tham số truyền vào
// meClient sẽ gọi hàm me với sessionToken lấy từ clientSessionToken
   // me sẽ gọi hàm meClient với sessionToken truyền vào 
   // bởi vì chúng ta đã có 1 cái object để lưu sessionToken rồi.
   updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("account/me", body),
};

export default accountApiRequests;
