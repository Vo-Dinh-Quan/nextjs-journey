"use client";

import { Button } from "@/components/ui/button";
import { ProductResType } from "@/schemaValidations/product.schema";
import React from "react";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import productApiRequest from "@/apiRequests/product";
import { handleErrorApi } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function DeleteProduct({
   product,
}: {
   product: ProductResType["data"];
}) {
   const {toast} = useToast();
   const router = useRouter();
   const deleteProduct = async () => {
      // bởi vì delete này gọi ở client component nên không cần truyền sessionToken, chúng ta đã config ở http.ts rồi
      try {
         const response = await productApiRequest.delete(product.id);
         toast( {
            description: response.payload.message
         })
         router.refresh();
      } catch (error) {
         handleErrorApi({error});
      }
   };

   return (
      <>
         <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button variant={"destructive"} >
                  Delete
               </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>
                     Bạn có muốn xóa sản phẩm không
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     Sản phẩm &rdquo;{product.name}&rdquo; sẽ bị xóa vĩnh viễn.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteProduct}>Continue</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}
