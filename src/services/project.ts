import {IProject} from '@/app/(main)/project/page'
import {api} from './api'
import {PageRequestArgs} from './user'

interface ProjectResponse {
  status: string;
  msg: {
    totalNumber: number;
    projects: IProject[];
  }
}

const projectApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<ProjectResponse, PageRequestArgs>({
      query: ({page, itemsPerPage, sortField, sortOrder, globalFilter}: PageRequestArgs) => `/project/projects?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&globalFilter=${globalFilter}`,
      providesTags: (_result) => (_result ? (_result.msg?.projects?.map(({_id}) => ({type: 'Project' as const, id: _id})).concat({id: 'LIST', type: 'Project'})) : [{type: 'Project', id: 'LIST'}]),
    }),
    findProjectById: build.query<ProjectResponse, string>({
      query: (id: string) => `/project/project/${id}`,
      providesTags: (_result, _error, id) => [{type: 'Project', id: id}],
    }),
    getAllProject: build.query<{ status: string; msg: IProject[]}, unknown>({
      query: () => `/project/getAllDoc`,
      providesTags: (_result) => (_result ? (_result.msg?.map(({_id}) => ({type: 'Project' as const, id: _id})).concat({id: 'LIST', type: 'Project'})) : [{type: 'Project', id: 'LIST'}]),
    }),
    updateProject: build.mutation<ProjectResponse, IProject>({
      query: (body: IProject) => ({
        url: `/project/project/${body._id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [{type: 'Project', id: arg._id}],
    }),
    createProject: build.mutation<ProjectResponse, Partial<IProject>>({
      query: (body: Partial<IProject>) => ({
        url: `/project/project`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [{type: 'Project', id: 'LIST'}],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useLazyGetProjectsQuery,
  useFindProjectByIdQuery,
  useLazyFindProjectByIdQuery,
  useGetAllProjectQuery,
  useUpdateProjectMutation,
  useCreateProjectMutation,
} = projectApi
