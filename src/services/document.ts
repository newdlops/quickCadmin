import { Document } from '@/app/(main)/documents/page'
import { api } from './api'
import { PageRequestArgs } from './user'

interface DocumentResponse {
  status: string;
  msg: {
    totalNumber: number;
    documents: Document[];
  }
}

const documentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<DocumentResponse, PageRequestArgs>({
      query: ({ page, itemsPerPage, sortField, sortOrder, globalFilter }: PageRequestArgs) => `/document/documents?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (result?: DocumentResponse) => (result ? result?.msg?.documents?.map(({_id}) => ({ type: 'Document' as const, id: _id })).concat({ type: 'Document', id: 'LIST'}) : [{ type: 'Document', id: 'LIST'}]),
    }),
    findDocumentById: build.query<{ status: string, msg: { totalNumber: number; documents: Document[]; } }, string>({
      query: (id: string) => `/document/document/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Document', id}],
    }),
    updateDocument: build.mutation<DocumentResponse, Document>({
      query: (body: Document) => ({
        url: `/document/document/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Document', id: arg._id }],
    }),
    createDocument: build.mutation<DocumentResponse, Partial<Document>>({
      query: (body: Partial<Document>) => ({
        url: `/document/document`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type:'Document', id:'LIST'}],
    }),
  }),
})

export const {
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useFindDocumentByIdQuery,
  useLazyFindDocumentByIdQuery,
  useUpdateDocumentMutation,
  useCreateDocumentMutation,
} = documentApi