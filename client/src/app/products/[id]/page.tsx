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
      const resolvedParams = await params;
      console.log("Fetching product details for ID:", resolvedParams.id);
      const { payload } = await productApiRequest.getDetail(Number(resolvedParams.id));
      product = payload.data;
      console.log("Product details:", product);
   } catch (error) {
      console.error("Error fetching product details:", error);
   }

   return (
      <div className="flex justify-center">
         {!product && <div>Không tìm thấy sản phẩm</div>}
         {product && <ProductAddForm product={product} />}
      </div>
   );
}