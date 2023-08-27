import { Laboratory } from '@/app/(main)/laboratory/page'
import { api } from './api'
import { PageRequestArgs } from './user'

interface LaboratoryResponse {
  status: string;
  msg: {
    totalNumber: number;
    laboratorys: Laboratory[];
  }
}

const laboratoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLaboratorys: build.query<LaboratoryResponse, PageRequestArgs>({
      query: ({ page, itemsPerPage, sortField, sortOrder, globalFilter }: PageRequestArgs) => `/laboratory/laboratorys?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (result?: LaboratoryResponse) => (result ? result?.msg?.laboratorys?.map(({_id}) => ({ type: 'Laboratory', id: _id })) : [{ type: 'Laboratory', id: 'LIST' }]),
    }),
    findLaboratoryById: build.query<{ status: string, msg: { totalNumber: number; laboratorys: Laboratory[]; } }, string>({
      query: (id: string) => `/laboratory/laboratory/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Laboratory', id}],
    }),
    updateLaboratory: build.mutation<LaboratoryResponse, Laboratory>({
      query: (body: Laboratory) => ({
        url: `/laboratory/laboratory/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Laboratory', id: arg._id }],
    }),
    createLaboratory: build.mutation<LaboratoryResponse, Partial<Laboratory>>({
      query: (body: Partial<Laboratory>) => ({
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
  useUpdateLaboratoryMutation,
  useCreateLaboratoryMutation,
} = laboratoryApi