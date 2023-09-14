import { Product } from '@/app/(main)/product/page'
import { api } from './api'

interface ProductResponse {
  status: string;
  msg: {
    totalNumber: number;
    products: Product[];
  }
}

export interface PageRequestArgs {
  page?: number;
  itemsPerPage: number;
  sortField: string;
  sortOrder: 0|1|-1|null|undefined;
  globalFilter: string;
}

const productApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductResponse, PageRequestArgs>({
      query: ({ page, itemsPerPage, sortField, sortOrder, globalFilter }: PageRequestArgs) => `/product/products?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (result?: ProductResponse) => (result ? result?.msg?.products?.map(({_id}) => ({ type: 'Product' as const, id: _id })).concat({ type:'Product', id: 'LIST'}) : [{ type:'Product', id: 'LIST' }]),
    }),
    findProductById: build.query<{ status: string, msg: { totalNumber: number; products: Product[]; } }, string>({
      query: (id: string) => `/product/product/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id: id}],
    }),
    deleteProduct: build.mutation<ProductResponse, string>({
      query: (id: string) => ({
        url: `/product/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Product', id: arg }],
    }),
    updateProduct: build.mutation<ProductResponse, Product>({
      query: (body: Product) => ({
        url: `/product/product/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Product', id: arg._id }],
    }),
    createProduct: build.mutation<ProductResponse, Partial<Product>>({
      query: (body: Partial<Product>) => ({
        url: `/product/product`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{ type:'Product', id: 'LIST'}],
    }),
    deleteProducts: build.mutation<ProductResponse, string[]>({
      query: (ids: string[]) => ({
        url: `/product/delete`,
        method: 'POST',
        body: ids,
      }),
      invalidatesTags: (_result, _error, arg) => arg.map(_id => ({ type: 'Product', id: _id})),
    }),
  }),
})

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useFindProductByIdQuery,
  useLazyFindProductByIdQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductsMutation,
} = productApi
