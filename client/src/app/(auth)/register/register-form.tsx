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
import {
   RegisterBody,
   RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import envConfig from "@/config";

const RegisterForm = () => {
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
      const result = fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(values),
      })
         .then((res) => res.json())
         .then((data) => {
            console.log(data);
         });
      console.log(result);
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
                        <Input placeholder="Shadcn UI" {...field} />
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
                        <Input placeholder="Shadcn UI" {...field} />
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
                        <Input placeholder="Shadcn UI" {...field} type="password"/>
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
