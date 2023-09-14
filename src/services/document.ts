import {RequiredDocument} from '@/app/(main)/documents/page'
import {api} from './api'
import {PageRequestArgs} from './user'

interface DocumentResponse {
  status: string;
  msg: {
    totalNumber: number;
    documents: RequiredDocument[];
  }
}

const documentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<DocumentResponse, PageRequestArgs>({
      query: ({page, itemsPerPage, sortField, sortOrder, globalFilter}: PageRequestArgs) => `/document/documents?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (_result) => (_result ? (_result.msg?.documents?.map(({_id}) => ({type: 'Document' as const, id: _id})).concat({id: 'LIST', type: 'Document'})) : [{type: 'Document', id: 'LIST'}]),
    }),
    findDocumentById: build.query<DocumentResponse, string>({
      query: (id: string) => `/document/document/${id}`,
      providesTags: (_result, _error, id) => [{type: 'Document', id: id}],
    }),
    getAllDocument: build.query<{ status: string; msg: RequiredDocument[]}, unknown>({
      query: () => `/document/getAllDoc`,
      providesTags: (_result) => (_result ? (_result.msg?.map(({_id}) => ({type: 'Document' as const, id: _id})).concat({id: 'LIST', type: 'Document'})) : [{type: 'Document', id: 'LIST'}]),
    }),
    updateDocument: build.mutation<DocumentResponse, RequiredDocument>({
      query: (body: RequiredDocument) => ({
        url: `/document/document/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{type: 'Document', id: arg._id}],
    }),
    createDocument: build.mutation<DocumentResponse, Partial<RequiredDocument>>({
      query: (body: Partial<RequiredDocument>) => ({
        url: `/document/document`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type: 'Document', id: 'LIST'}],
    }),
  }),
})

export const {
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useFindDocumentByIdQuery,
  useLazyFindDocumentByIdQuery,
  useGetAllDocumentQuery,
  useUpdateDocumentMutation,
  useCreateDocumentMutation,
} = documentApi
