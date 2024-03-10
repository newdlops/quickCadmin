import { IUser } from '@/app/(main)/user/page'
import { api } from './api'
import Cookies from 'js-cookie'

interface UserResponse {
  status: string;
  msg: {
    totalNumber: number;
    users: IUser[];
  }
}

export interface PageRequestArgs {
  page?: number;
  itemsPerPage: number;
  sortField: string;
  sortOrder: 0|1|-1|null|undefined;
  globalFilter: string;
}

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserResponse, PageRequestArgs>({
      query: ({ page, itemsPerPage, sortField, sortOrder, globalFilter }: PageRequestArgs) => `/user/users?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (result?: UserResponse) => (result ? result?.msg?.users?.map(({_id}) => ({ type: 'User' as const, id: _id })).concat({ type:'User', id: 'LIST'}) : [{ type:'User', id: 'LIST' }]),
    }),
    findUserById: build.query<{ status: string, msg: { totalNumber: number; users: IUser[]; } }, string>({
      query: (id: string) => `/user/user/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id: id}],
    }),
    adminLogin: build.query<{ status: string}, Partial<IUser>>({
      query: (body: Partial<IUser>) => ({
        url: `/user/adminlogin/`,
        method: 'POST',
        body: body,
      }),
      async onQueryStarted(arg, { queryFulfilled}){
        try {
          const { data } = await queryFulfilled
          Cookies.set('accessToken', data.msg.accessToken)
        } catch (e) {
          console.log('login failed', e)
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'User'}],
    }),
    tokenLogin: build.query<{status: string }, null>({
      query: ()=> {
        const accessToken = Cookies.get('accessToken')
        return `/user/userTokenLogin/${encodeURIComponent(accessToken ?? '')}`
      },
      providesTags: (_result, _error, id) => [{ type: 'User', id: id}],
    }),
    deleteUser: build.mutation<UserResponse, string>({
      query: (id: string) => ({
        url: `/user/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'User', id: arg }],
    }),
    updateUser: build.mutation<UserResponse, IUser>({
      query: (body: IUser) => ({
        url: `/user/user/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'User', id: arg._id }],
    }),
    createUser: build.mutation<UserResponse, Partial<IUser>>({
      query: (body: Partial<IUser>) => ({
        url: `/user/user`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{ type:'User', id: 'LIST'}],
    }),
    deleteUsers: build.mutation<UserResponse, string[]>({
      query: (ids: string[]) => ({
        url: `/user/delete`,
        method: 'POST',
        body: ids,
      }),
      invalidatesTags: (_result, _error, arg) => arg.map(_id => ({ type: 'User', id: _id})),
    }),
  }),
})

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useFindUserByIdQuery,
  useLazyFindUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUsersMutation,
  useLazyAdminLoginQuery,
  useTokenLoginQuery,
} = userApi
