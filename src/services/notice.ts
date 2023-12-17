import {INotice} from '@/app/(main)/notice/page'
import {api} from './api'
import {PageRequestArgs} from './user'

interface NoticeResponse {
  status: string;
  msg: {
    totalNumber: number;
    notices: INotice[];
  }
}

const noticeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotices: build.query<NoticeResponse, PageRequestArgs>({
      query: ({page, itemsPerPage, sortField, sortOrder, globalFilter}: PageRequestArgs) => `/notice/noticeList?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (_result) => (_result ? (_result.msg?.notices?.map(({_id}) => ({type: 'Notice' as const, id: _id})).concat({id: 'LIST', type: 'Notice'})) : [{type: 'Notice', id: 'LIST'}]),
    }),
    findNoticeById: build.query<NoticeResponse, string>({
      query: (id: string) => `/notice/notice/${id}`,
      providesTags: (_result, _error, id) => [{type: 'Notice', id: id}],
    }),
    getAllNotice: build.query<{ status: string; msg: INotice[]}, unknown>({
      query: () => `/notice/getAllDoc`,
      providesTags: (_result) => (_result ? (_result.msg?.map(({_id}) => ({type: 'Notice' as const, id: _id})).concat({id: 'LIST', type: 'Notice'})) : [{type: 'Notice', id: 'LIST'}]),
    }),
    updateNotice: build.mutation<NoticeResponse, INotice>({
      query: (body: INotice) => ({
        url: `/notice/notice/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{type: 'Notice', id: arg._id}],
    }),
    createNotice: build.mutation<NoticeResponse, Partial<INotice>>({
      query: (body: Partial<INotice>) => ({
        url: `/notice/notice`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type: 'Notice', id: 'LIST'}],
    }),
  }),
})

export const {
  useGetNoticesQuery,
  useGetAllNoticeQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
} = noticeApi
