import { MessageResType } from './../schemaValidations/common.schema';
import http from "@/lib/http";
import { CreateProductBodyType, ProductListResType, ProductResType, UpdateProductBodyType } from "@/schemaValidations/product.schema";

const productApiRequest = {
   getList: () => http.get<ProductListResType>("/products"),
   getDetail: (id: number) => http.get<ProductResType>(`/products/${id}`),
   create: (body: CreateProductBodyType) => http.post<ProductResType>("/products", body),
   update: (id: number, body: UpdateProductBodyType) => http.put<ProductResType>(`/products/${id}`, body, { cache: 'no-store'}),
   delete: (id: number) => http.delete<MessageResType>(`/products/${id}`, { cache: 'no-store'}),
   uploadImage: (body: FormData) => http.post<{ 
      message: string;
      data: string
   }>('/media/upload', body)
};

export default productApiRequest;