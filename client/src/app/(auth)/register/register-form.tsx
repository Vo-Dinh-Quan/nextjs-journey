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
import {
   RegisterBody,
   RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import authApiRequests from "@/apiRequests/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

const RegisterForm = () => {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const router = useRouter();

   // 1. Define form.
   const form = useForm<RegisterBodyType>({
      resolver: zodResolver(RegisterBody),
      defaultValues: {
         email: "",
         name: "",
         password: "",
         confirmPassword: "",
      },
   });

   // 2. Define a submit handler.
   async function onSubmit(values: RegisterBodyType) {
      if (loading) return;
      setLoading(true);
      try {
         // Chờ kết quả từ fetch
         const response = await authApiRequests.register(values);
         await authApiRequests.auth({
            sessionToken: response.payload.data.token,
            expiresAt: response.payload.data.expiresAt,
         });
         toast({
            description: response.payload.message,
         });
         router.push("/me");
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
                           placeholder="Shadcn UI"
                           {...field}
                           autoComplete="name"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Shadcn UI"
                           {...field}
                           type="email"
                           formNoValidate
                           autoComplete="email"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Mật khẩu</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Shadcn UI"
                           {...field}
                           autoComplete="new-password"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="confirmPassword"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Xác nhận mật khẩu</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Shadcn UI"
                           {...field}
                           type="password"
                           autoComplete="new-password"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" className="!mt-10 w-full">
               Đăng ký
            </Button>
         </form>
      </Form>
   );
};

export default RegisterForm;
