import {IWrongInformation} from '@/app/(main)/wrongInformation/page'
import {api} from './api'
import {PageRequestArgs} from './user'

interface WrongInformationResponse {
  status: string;
  msg: {
    totalNumber: number;
    wrongInformations: IWrongInformation[];
  }
}

const wrongInformationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWrongInformations: build.query<WrongInformationResponse, PageRequestArgs>({
      query: ({page, itemsPerPage, sortField, sortOrder, globalFilter}: PageRequestArgs) => `/wrongInformation/wrongInformationList?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (_result) => (_result ? (_result.msg?.wrongInformations?.map(({_id}) => ({type: 'WrongInformation' as const, id: _id})).concat({id: 'LIST', type: 'WrongInformation'})) : [{type: 'WrongInformation', id: 'LIST'}]),
    }),
    findWrongInformationById: build.query<WrongInformationResponse, string>({
      query: (id: string) => `/wrongInformation/wrongInformation/${id}`,
      providesTags: (_result, _error, id) => [{type: 'WrongInformation', id: id}],
    }),
    getAllWrongInformation: build.query<{ status: string; msg: IWrongInformation[]}, unknown>({
      query: () => `/wrongInformation/getAllDoc`,
      providesTags: (_result) => (_result ? (_result.msg?.map(({_id}) => ({type: 'WrongInformation' as const, id: _id})).concat({id: 'LIST', type: 'WrongInformation'})) : [{type: 'WrongInformation', id: 'LIST'}]),
    }),
    updateWrongInformation: build.mutation<WrongInformationResponse, IWrongInformation>({
      query: (body: IWrongInformation) => ({
        url: `/wrongInformation/wrongInformation/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{type: 'WrongInformation', id: arg._id}],
    }),
    createWrongInformation: build.mutation<WrongInformationResponse, Partial<IWrongInformation>>({
      query: (body: Partial<IWrongInformation>) => ({
        url: `/wrongInformation/wrongInformation`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type: 'WrongInformation', id: 'LIST'}],
    }),
  }),
})

export const {
  useGetWrongInformationsQuery,
  useGetAllWrongInformationQuery,
  useCreateWrongInformationMutation,
  useUpdateWrongInformationMutation,
} = wrongInformationApi
