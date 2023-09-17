import {api} from './api'
import {IProjectItem} from "@/app/(main)/project/projectdetail/page"
import {IProject} from "@/app/(main)/project/page"

interface ProjectItemResponse {
  status: string;
  msg: IProjectItem[]
}

const projectItemApi = api.injectEndpoints({
  endpoints: (build) => ({
    findProjectItemByProject: build.query<ProjectItemResponse, IProject>({
      query: (body: IProject) => ({
        url: `/projectItem/findByProject`,
        method: 'POST',
        body: body,
      }),
      providesTags: (_result) => (_result ? (_result.msg?.map(({_id}) => ({type: 'ProjectItem' as const, id: _id})).concat({id: 'LIST', type: 'ProjectItem'})) : [{type: 'ProjectItem', id: 'LIST'}]),
    }),
    updateProjectItem: build.mutation<ProjectItemResponse, IProjectItem>({
      query: (body: IProjectItem) => ({
        url: `/projectItem/projectItem/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{type: 'ProjectItem', id: arg._id}, {type: 'ProjectItem', id: 'LIST'}],
    }),
    createProjectItem: build.mutation<ProjectItemResponse, Partial<IProjectItem>>({
      query: (body: Partial<IProjectItem>) => ({
        url: `/projectItem/create`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type: 'ProjectItem', id: 'LIST'}],
    }),
  }),
})

export const {
  useCreateProjectItemMutation,
  useUpdateProjectItemMutation,
  useFindProjectItemByProjectQuery,
} = projectItemApi
