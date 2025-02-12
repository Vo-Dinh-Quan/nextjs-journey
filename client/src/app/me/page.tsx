import React from "react";
import { cookies } from "next/headers";
import Profile from "@/app/me/profile";
import accountApiRequests from "@/apiRequests/account";
import ProfileForm from "@/app/me/profile-form";

const MeProfile = async () => {
   const cookieStore = await cookies();
   const sessionToken = cookieStore.get("sessionToken");
   
   // Khi sử dụng cookie để xác thực, dữ liệu thường không được cache trên server để đảm bảo rằng mỗi yêu cầu đều nhận được dữ liệu mới nhất dựa trên thông tin xác thực hiện tại.
   const response = await accountApiRequests.me(sessionToken?.value ?? ''); 

   // ở profile-form.tsx sau khi cập nhật thông tin thành công, chúng ta đã sử dụng câu lệnh router.refresh() để refresh lại trang. Nó sẽ làm các việc sau:
   // refresh lại current route. 
   // Tạo 1 request đến next server để nó re-fetching data request. Giả sử trong trường hợp chúng ta không dùng cookie thì nó sẽ caching và sẽ lấy lại dữ liệu cũ. Còn trong trường hợp này chúng ta đang sử dụng cookie nên nó sẽ không caching và sẽ lấy dữ liệu mới nhất. Nó sẽ gửi 1 cái request lên next server Next server sẽ gửi lại payload chứa các React Server Side Component (RSC) và merge với các Client Component trên client.
   return (
      <div className="flex justify-center">
         <ProfileForm profile={response.payload.data}/>
      </div>   
   );
};

export default MeProfile;
