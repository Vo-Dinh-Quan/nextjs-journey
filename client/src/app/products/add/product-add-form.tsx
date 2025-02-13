"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import {
   CreateProductBody,
   CreateProductBodyType,
} from "@/schemaValidations/product.schema";
import productApiRequest from "@/apiRequests/product";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const ProductAddForm = () => {
   const [file, setFile] = useState<File | null>(null); // file sẽ được gán giá trị từ useState<File | null>(null)
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const router = useRouter();

   // 1. Define form.
   const form = useForm<CreateProductBodyType>({
      resolver: zodResolver(CreateProductBody),
      defaultValues: {
         name: "",
         price: 0,
         description: "",
         image: "",
      },
   });

   // 2. Define a submit handler.
   async function onSubmit(values: CreateProductBodyType) {
      console.log(values);
      if (loading) return;
      setLoading(true);
      try {
         const formData = new FormData();
         formData.append("file", file as Blob); // file as Blob nghĩa là file sẽ được ép kiểu về Blob (Blob là một kiểu dữ liệu đặc biệt trong JavaScript, nó chứa dữ liệu không xác định hoặc không cần xác định)
         const uploadImageResponse = await productApiRequest.uploadImage(
            formData
         );
         const imageUrl = uploadImageResponse.payload.data;
         const response = await productApiRequest.create({
            ...values,
            image: imageUrl,
         });
         toast({
            description: response.payload.message,
         });
         router.push("/products");
      } catch (error: any) {
         handleErrorApi({
            error,
            setError: form.setError, // cú pháp ở đây có nghĩa là setError sẽ được gán giá trị từ form.setError
            // cú pháp này giúp chúng ta truyền giá trị setError từ form.setError vào hàm handleErrorApi
         });
      } finally {
         setLoading(false);
      }
   }
   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
               console.log(errors);
               console.log(form.getValues());
            })}
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate>
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Tên</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Vui lòng nhập tên sản phẩm"
                           {...field}
                           type="text"
                           formNoValidate
                           autoComplete="text"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="price"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Giá</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Giá sản phẩm"
                           {...field}
                           type="number"
                           formNoValidate
                           autoComplete="text"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Mô tả sản phẩm</FormLabel>
                     <FormControl>
                        <Textarea placeholder="Mô tả sản phẩm" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="image"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Hình ảnh</FormLabel>
                     <FormControl>
                        <Input
                           type="file"
                           accept="image/*"
                           onClick={(e: any) => {
                              e.target.value = null;
                           }} // reset value để có thể chọn lại cùng 1 file
                           onChange={(e) => {
                              const file = e.target.files?.[0]; // ?[0] nghĩa là nếu có file thì lấy file đầu tiên, nếu không có file thì trả về undefined
                              console.log(file?.name);
                              if (file) {
                                 // nếu file tồn tại
                                 setFile(file);
                                 field.onChange(
                                    "http://localhost:3000/"
                                    + file.name
                                 ); // fake url để có thể pass qua được zod validation
                              }
                           }}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            {file && (
               <div className="flex items-center justify-around gap-4">
                  <Image
                     src={URL.createObjectURL(file)}
                     alt="preview"
                     width={128}
                     height={128}
                     className="w-20 h-20 object-cover rounded-md"
                  />
                  <Button type="button" variant={"destructive"} size={"sm"} 
                     onClick={() => {
                        setFile(null);
                        form.setValue("image", "");
                     }}>
                     Xóa hình ảnh
                  </Button>
               </div>
            )}
            <Button type="submit" className="!mt-10 w-full">
               Thêm sản phẩm
            </Button>
         </form>
      </Form>
   );
};

export default ProductAddForm;
