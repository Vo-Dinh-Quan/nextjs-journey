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
import { handleErrorApi } from "@/lib/utils";
import {
   AccountResType,
   UpdateMeBody,
   UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import accountApiRequests from "@/apiRequests/account";
import { useRouter } from "next/navigation";

type Profile = AccountResType["data"];

const ProfileForm = ({ profile }: { profile: Profile }) => {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const router = useRouter();
   // 1. Define form.
   const form = useForm<UpdateMeBodyType>({
      resolver: zodResolver(UpdateMeBody),
      defaultValues: {
         name: profile.name,
      },
   });

   // 2. Define a submit handler.
   async function onSubmit(values: UpdateMeBodyType) {
      if (loading) return;
      setLoading(true);
      try {
         // Chờ kết quả từ fetch
         const response = await accountApiRequests.updateMe(values);

         toast({
            description: response.payload.message,
         });
         router.refresh();
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
            <FormLabel>Email</FormLabel>
            <FormControl>
               <Input
                  placeholder="Email của bạn"
                  value={profile.email}
                  readOnly
                  type="email"
                  formNoValidate
                  autoComplete="email"
               />
            </FormControl>
            <FormMessage />

            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Tên</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="Tên của bạn"
                           {...field}
                           type="text"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" className="!mt-10 w-full">
               Cập nhật
            </Button>
         </form>
      </Form>
   );
};

export default ProfileForm;
