import productApiRequest from "@/apiRequests/product";
import React from "react";

export default async function ProductEdit({
   params,
}: {
   params: { id: string };
}) {
   let product = null;
   try {
      console.log(params);
      const { payload } = await productApiRequest.getDetail(Number(params.id));
      product = payload.data;
      console.log(product);
   } catch (error) {
      console.log(error);
   }

   return (
      <div>
         {!product && <div>Không tìm thấy sản phẩm</div>}
         {product && <div>{product.name}</div>}
      </div>
   );
}
