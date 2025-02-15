"use client";

import DeleteProduct from "@/app/products/_components/delete-product";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

export type Product = {
   id: number;
   name: string;
   price: number;
   description: string;
   image: string;
   createdAt: Date;
   updatedAt: Date;
};

export const columns: ColumnDef<Product>[] = [
   {
      accessorKey: "id",
      header: "ID",
   },
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "price",
      header: "Price",
   },
   {
      accessorKey: "description",
      header: "Description",
   },
   {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
         <Image
            src={row.original.image}
            alt={row.original.name}
            width={180}
            height={180}
            className="w-20 h-20 object-cover"
         />
      ),
   },
   {
      accessorKey: "createdAt",
      header: "Created At",
   },
   {
      accessorKey: "updatedAt",
      header: "Updated At",
   },
   {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
         <div className="flex space-x-2">
            <Link href={`/products/${row.original.id}`}><Button variant={"outline"}>Edit</Button></Link>
            <DeleteProduct product={row.original} />
         </div>
      ),
   },
];
