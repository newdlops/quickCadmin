import {IRequestInformation} from '@/app/(main)/requestInformation/page'
import {api} from './api'
import {PageRequestArgs} from './user'

interface RequestInformationResponse {
  status: string;
  msg: {
    totalNumber: number;
    requestInformations: IRequestInformation[];
  }
}

const requestInformationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRequestInformations: build.query<RequestInformationResponse, PageRequestArgs>({
      query: ({page, itemsPerPage, sortField, sortOrder, globalFilter}: PageRequestArgs) => `/requestInformation/requestInformationList?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (_result) => (_result ? (_result.msg?.requestInformations?.map(({_id}) => ({type: 'RequestInformation' as const, id: _id})).concat({id: 'LIST', type: 'RequestInformation'})) : [{type: 'RequestInformation', id: 'LIST'}]),
    }),
    findRequestInformationById: build.query<RequestInformationResponse, string>({
      query: (id: string) => `/requestInformation/requestInformation/${id}`,
      providesTags: (_result, _error, id) => [{type: 'RequestInformation', id: id}],
    }),
    getAllRequestInformation: build.query<{ status: string; msg: IRequestInformation[]}, unknown>({
      query: () => `/requestInformation/getAllDoc`,
      providesTags: (_result) => (_result ? (_result.msg?.map(({_id}) => ({type: 'RequestInformation' as const, id: _id})).concat({id: 'LIST', type: 'RequestInformation'})) : [{type: 'RequestInformation', id: 'LIST'}]),
    }),
    updateRequestInformation: build.mutation<RequestInformationResponse, IRequestInformation>({
      query: (body: IRequestInformation) => ({
        url: `/requestInformation/requestInformation/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{type: 'RequestInformation', id: arg._id}],
    }),
    createRequestInformation: build.mutation<RequestInformationResponse, Partial<IRequestInformation>>({
      query: (body: Partial<IRequestInformation>) => ({
        url: `/requestInformation/requestInformation`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type: 'RequestInformation', id: 'LIST'}],
    }),
  }),
})

export const {
  useGetRequestInformationsQuery,
  useGetAllRequestInformationQuery,
  useCreateRequestInformationMutation,
  useUpdateRequestInformationMutation,
} = requestInformationApi
