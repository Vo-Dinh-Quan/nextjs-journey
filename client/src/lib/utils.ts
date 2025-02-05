import { toast } from "@/hooks/use-toast"
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({error, setError, duration} : {
  error: any,
  setError?: UseFormSetError<any>, // chúng ta dùng kiểu UseFormSetError<any> bởi vì chúng ta không biết field của error là gì
  duration?: number
}) => {
  if(error instanceof EntityError && setError) { // Nếu error thuộc kiểu EntityError và setError được truyền vào
    error.payload.errors.forEach(item => {
      setError(item.field, { // setError
        type: "server",
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: "destructive",
      duration: duration ?? 5000
    })
  }
}

// Giả sử UI trả về lỗi: 
/*
{
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email không hợp lệ" },
    { "field": "password", "message": "Mật khẩu phải có ít nhất 6 ký tự" }
  ]
}
handleErrorApi sẽ thực hiện:

// Lặp qua từng lỗi và set vào form
setError("email", { type: "server", message: "Email không hợp lệ" });
setError("password", { type: "server", message: "Mật khẩu phải có ít nhất 6 ký tự" });

*/