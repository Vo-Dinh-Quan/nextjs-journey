import productApiRequest from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import React from "react";

export default async function ProductEdit({
   params,
}: {
   params: { id: string };
}) {
   let product = undefined;
   try {
      console.log(params);
      const { payload } = await productApiRequest.getDetail(Number(params.id));
      product = payload.data;
      console.log(product);
   } catch (error) {
      console.log(error);
   }

   return (
      <div className="flex justify-center">
         {!product && <div>Không tìm thấy sản phẩm</div>}
         {product && <ProductAddForm product={product} />}
      </div>
   );
}
