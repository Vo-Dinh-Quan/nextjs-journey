import productApiRequest from "@/apiRequests/product";
import { columns } from "@/app/products/columns";
import { DataTable } from "@/app/products/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function page() {
   const { payload } = await productApiRequest.getList();
   const productList = payload.data;
   return (
      <div className="container ml-20 mr-20">
         <Link href={'/products/add/'} ><Button variant={'secondary'}>Thêm sản phẩm</Button></Link>
         <div className="flex justify-center">
            {" "}
            <h1 className="text-3xl font-semibold my-4 mx-auto">
               Product List Page
            </h1>
         </div>
         <div className="mt-10">
            <DataTable columns={columns} data={productList} />
         </div>
      </div>
   );
}
