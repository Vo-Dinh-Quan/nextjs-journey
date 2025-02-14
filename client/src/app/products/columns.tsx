"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

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
            <Button variant={"outline"}>Edit</Button>
            <Button variant={"destructive"}>Delete</Button>
         </div>
      ),
   },
];

// Example handlers for edit and delete actions
const handleEdit = (product: Product) => {
   // Handle edit action
   console.log("Edit product", product);
};

const handleDelete = (id: number) => {
   // Handle delete action
   console.log("Delete product with id", id);
};
