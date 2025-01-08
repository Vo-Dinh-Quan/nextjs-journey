"use client";

import React from "react";
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
import envConfig from "@/config";
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/app/app-provider";


const LoginForm = () => {
   const { toast } = useToast();
   const { setSessionToken } = useAppContext();
   
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
      try {
         // Chờ kết quả từ fetch
         const response = await fetch(
            `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(values),
            }
         );
         const payload = await response.json();
         const data = { // Tạo object chứa thông tin kết quả
            status: response.status,
            payload,
         };

         if (!response.ok) {
            throw data; 
         }
         console.log(data);
         toast({
            description: data.payload.message,
         })
         const resultFromNextServer =  await fetch('/api/auth', {
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         }).then(async (res) => {
            const payload = await res.json();
            const data = {
               status: res.status,
               payload,
            }
            if (!res.ok) {
               throw data;
            }
            return data
         })
         setSessionToken(resultFromNextServer.payload.data.token);
         // em quân dừng lại ở bài học phút thứ 50:20
      } catch (error: any) {
         const errors = error.payload.errors as {     
            field : string, 
            message: string
         }[];
         console.log(errors);
         const status = error.status as number;
         if (status === 422) {
            errors.forEach((error) => {
               form.setError(error.field as "email" | "password", {
                  type: "server",
                  message: error.message,
               })
            })
         }else {
            toast({
               title: "Lỗi",
               description: error.payload.message,
               variant: 'destructive'
            })
         }
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
                           placeholder="Shadcn UI"
                           {...field}
                           type="email"
                           formNoValidate
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
                           type="password"
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
