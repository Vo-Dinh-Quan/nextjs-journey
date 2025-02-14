import productApiRequest from "@/apiRequests/product";
import { columns } from "@/app/products/columns";
import { DataTable } from "@/app/products/data-table";
import { Table } from "@/components/ui/table";
import React from "react";

export default async function page() {
   const { payload } = await productApiRequest.getList();
   const productList = payload.data;
   return (
      <div>
         <div className="flex justify-center">
            {" "}
            <h1 className="text-3xl font-semibold my-4 mx-auto">
               Product List Page
            </h1>
         </div>
         <div className="mt-10 ml-20 mr-20">
            <DataTable columns={columns} data={productList} />
         </div>
      </div>
   );
}
