import {IFaq} from '@/app/(main)/faq/page'
import {api} from './api'
import {PageRequestArgs} from './user'

interface FaqResponse {
  status: string;
  msg: {
    totalNumber: number;
    faqs: IFaq[];
  }
}

const faqApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFaqs: build.query<FaqResponse, PageRequestArgs>({
      query: ({page, itemsPerPage, sortField, sortOrder, globalFilter}: PageRequestArgs) => `/faq/faqList?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (_result) => (_result ? (_result.msg?.faqs?.map(({_id}) => ({type: 'Faq' as const, id: _id})).concat({id: 'LIST', type: 'Faq'})) : [{type: 'Faq', id: 'LIST'}]),
    }),
    findFaqById: build.query<FaqResponse, string>({
      query: (id: string) => `/faq/faq/${id}`,
      providesTags: (_result, _error, id) => [{type: 'Faq', id: id}],
    }),
    getAllFaq: build.query<{ status: string; msg: IFaq[]}, unknown>({
      query: () => `/faq/getAllDoc`,
      providesTags: (_result) => (_result ? (_result.msg?.map(({_id}) => ({type: 'Faq' as const, id: _id})).concat({id: 'LIST', type: 'Faq'})) : [{type: 'Faq', id: 'LIST'}]),
    }),
    updateFaq: build.mutation<FaqResponse, IFaq>({
      query: (body: IFaq) => ({
        url: `/faq/faq/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{type: 'Faq', id: arg._id}],
    }),
    createFaq: build.mutation<FaqResponse, Partial<IFaq>>({
      query: (body: Partial<IFaq>) => ({
        url: `/faq/faq`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type: 'Faq', id: 'LIST'}],
    }),
  }),
})

export const {
  useGetFaqsQuery,
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
} = faqApi
