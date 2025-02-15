import ProductAddForm from "@/app/products/_components/product-add-form";
import React from "react";

export default function ProductPage() {
   return (
      <div>
         <div className="flex justify-center">
            <h1 className="text-3xl font-semibold my-4 mx-auto">
               Thêm sản phẩm
            </h1>
         </div>
         <div className="flex justify-center mb-10">
            <ProductAddForm />
         </div>
      </div>
   );
}
