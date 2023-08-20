import { SortOrder } from 'primereact/api'
import { api } from './api'

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<{ status: string, msg: any }, { page: number, itemsPerPage: number, sortField: string, sortOrder:number, globalFilter: string}>({
      query: ({ page, itemsPerPage, sortField, sortOrder, globalFilter }) => `/user/users?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
    }),
    findUserById: build.query<{ status: stringify, msg: any }, any>({
      query: (id: string) => `findUserById/${id}`,
    }),
  }),
})

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useFindUserByIdQuery,
  useLazyFindUserByIdQuery,
} = userApi