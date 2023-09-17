import { ILaboratory } from '@/app/(main)/laboratory/page'
import { api } from './api'
import { PageRequestArgs } from './user'

interface LaboratoryResponse {
  status: string;
  msg: {
    totalNumber: number;
    laboratorys: ILaboratory[];
  }
}

const laboratoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLaboratorys: build.query<LaboratoryResponse, PageRequestArgs>({
      query: ({ page, itemsPerPage, sortField, sortOrder, globalFilter }: PageRequestArgs) => `/laboratory/laboratorys?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (result?: LaboratoryResponse) => (result ? result?.msg?.laboratorys?.map(({_id}) => ({ type: 'Laboratory' as const, id: _id })).concat({ type: 'Laboratory', id: 'LIST' }) : [{ type: 'Laboratory', id: 'LIST' }]),
    }),
    findLaboratoryById: build.query<{ status: string, msg: { totalNumber: number; laboratorys: ILaboratory[]; } }, string>({
      query: (id: string) => `/laboratory/laboratory/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Laboratory', id: id}],
    }),
    getAllLaboratory: build.query<{ status: string; msg: ILaboratory[] }, unknown>({
      query: () => `/laboratory/getAllLab`,
      providesTags: (result?) => (result ? result?.msg?.map(({_id}) => ({ type: 'Laboratory' as const, id: _id })).concat({ type: 'Laboratory', id: 'LIST' }) : [{ type: 'Laboratory', id: 'LIST' }]),
    }),
    updateLaboratory: build.mutation<LaboratoryResponse, ILaboratory>({
      query: (body: ILaboratory) => ({
        url: `/laboratory/laboratory/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Laboratory', id: arg._id }],
    }),
    createLaboratory: build.mutation<LaboratoryResponse, Partial<ILaboratory>>({
      query: (body: Partial<ILaboratory>) => ({
        url: `/laboratory/laboratory`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{ type: 'Laboratory', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetLaboratorysQuery,
  useLazyGetLaboratorysQuery,
  useFindLaboratoryByIdQuery,
  useLazyFindLaboratoryByIdQuery,
  useGetAllLaboratoryQuery,
  useUpdateLaboratoryMutation,
  useCreateLaboratoryMutation,
} = laboratoryApi
