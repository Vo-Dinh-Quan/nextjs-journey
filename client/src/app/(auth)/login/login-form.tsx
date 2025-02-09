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
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { useToast } from "@/hooks/use-toast";
import authApiRequests from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

const LoginForm = () => {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const router = useRouter();

   // 1. Define form.
   const form = useForm<LoginBodyType>({
      resolver: zodResolver(LoginBody),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   // 2. Define a submit handler.
   async function onSubmit(values: LoginBodyType) {
      if (loading) return;
      setLoading(true);
      try {
         // Chờ kết quả từ fetch
         const response = await authApiRequests.login(values);
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
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Email của bạn"
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
                           placeholder="Vui lòng nhập mật khẩu"
                           {...field}
                           type="password"
                           autoComplete="current-password"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" className="!mt-10 w-full">
               Đăng nhập
            </Button>
         </form>
      </Form>
   );
};

export default LoginForm;
