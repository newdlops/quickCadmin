"use client"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {
  DataTable,
  DataTableCellSelection,
  DataTableSelectionCellChangeEvent,
  DataTableStateEvent,
  DataTableValueArray,
} from "primereact/datatable"
import {Dialog} from "primereact/dialog"
import {InputText} from "primereact/inputtext"
import {Toast} from "primereact/toast"
import {Toolbar} from "primereact/toolbar"
import {classNames} from "primereact/utils"
import React, {useRef, useState} from "react"
import {useCreateProjectMutation, useGetProjectsQuery, useUpdateProjectMutation} from '@/services/project'
import {ToggleButton, ToggleButtonChangeEvent} from 'primereact/togglebutton'
import {Calendar, CalendarChangeEvent} from "primereact/calendar"

export interface IProject {
  _id?: string;
  projectname: string;
  requestUser: any;
  modelName: string;
  manufacture: string;
  projectNumber: string;
  projectStartDate: Date;
  projectStatus: boolean;
  projectItems: Array<any>;

  [index: string | number]: string | number | boolean | Date | any | undefined;
}

const Project = () => {
  const emptyProject: IProject = {
    _id: "",
    projectname: "",
    requestUser: null,
    modelName: "",
    manufacture: "",
    projectNumber: "",
    projectStartDate: new Date(),
    projectStatus: false,
    projectItems: [],
  }
  const [lazyState, setLazyState] = useState<DataTableStateEvent>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: '',
    sortOrder: 1,
    filters: {},
    multiSortMeta: [],
  })

  const [projects, setProjects] = useState<IProject[]>([])
  const [projectDialog, setProjectDialog] = useState(false)
  const [projectCreate, setProjectCreate] = useState(false)
  const [project, setProject] = useState<IProject>(emptyProject)
  const [selectedProjects, setSelectedProjects] = useState<DataTableCellSelection<DataTableValueArray>>([])
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<DataTableValueArray>>(null)
  const {data, isLoading, refetch} = useGetProjectsQuery({
    page: lazyState.page,
    itemsPerPage: lazyState.rows,
    sortField: lazyState.sortField,
    sortOrder: lazyState.sortOrder,
    globalFilter: globalFilter,
  })
  const [updateProject, {isLoading: isUpdating}] = useUpdateProjectMutation()
  const [createProject, {isLoading: isCreating}] = useCreateProjectMutation()
  const isDataLoading = isLoading || isUpdating || isCreating
  const tableData = (data?.msg.projects) ?? ([] as DataTableValueArray)
  const openNew = () => {
    setProject(emptyProject)
    setProjectCreate(true)
    setSubmitted(false)
    setProjectDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProjectCreate(false)
    setProjectDialog(false)
  }
  const onPage = (event: DataTableStateEvent) => {
    setLazyState(event)
  }

  const onSort = (event: DataTableStateEvent) => {
    setLazyState(event)
  }

  const onFilter = (event: DataTableStateEvent) => {
    event['first'] = 0
    setLazyState(event)
  }

  const onSelectionChange = (e: DataTableSelectionCellChangeEvent<DataTableValueArray>) => {
    setSelectedProjects(e.value)
  }

  const saveProject = () => {
    setSubmitted(true)

    if (project.projectname.trim()) {
      const _projects = [...projects]
      const _project = {...project}
      if (project._id) {
        const index = findIndexById(project._id)

        _projects[index] = _project
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "프로젝트 정보가 업데이트되었습니다.",
          life: 3000,
        })
        updateProject(_project).catch(e => console.log(e))
      } else {
        _projects.push(_project)
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "프로젝트정보가 생성되었습니다.",
          life: 3000,
        })
        delete _project._id
        createProject(_project).then(() => {
          tableData.length < 1 && refetch().catch(e => console.log(e))
        }).catch(e => console.log(e))
      }
      setProjects(_projects)
      setProjectDialog(false)
      setProjectCreate(false)
      setProject(emptyProject)
    }
  }
  const onToggleSubstitution = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _project = {...project, projectStatus: e.value}
    setProject(_project)
  }
  const editProject = (_project: IProject) => {
    setProject({..._project})
    setProjectDialog(true)
  }
  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < projects.length; i++) {
      if (projects[i]._id === id) {
        index = i
        break
      }
    }

    return index
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _project = {...project}
    _project[`${name}`] = val

    setProject(_project)
  }

  const onDateChange = (
    e: CalendarChangeEvent,
  ) => {
    setProject({...project, projectStartDate: new Date(e.value as string)})
  }
  const leftToolbarTemplate = () => (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="신규프로젝트등록"
          icon="pi pi-plus"
          severity="success"
          className=" mr-2"
          onClick={openNew}
        />
      </div>
    </React.Fragment>
  )

  const rightToolbarTemplate = () => (
    <React.Fragment>
      <Button
        label="CSV출력"
        icon="pi pi-upload"
        severity="help"
        onClick={exportCSV}
      />
    </React.Fragment>
  )

  const actionBodyTemplate = (rowData: IProject) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => editProject(rowData)}
      />
    </>
  )

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">프로젝트정보관리</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search"/>
        <InputText
          type="검색"
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="검색어를 입력하세요..."
        />
      </span>
    </div>
  )

  const projectDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={hideDialog}/>
      <Button label={projectCreate ? "등록" : "수정"} icon="pi pi-check" text onClick={saveProject}/>
    </>
  )

  const localDate = (rowData: IProject) => new Date(rowData.projectStartDate).toLocaleString()
  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast}/>
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={tableData}
            dataKey="_id"
            paginator
            rows={lazyState.rows}
            rowsPerPageOptions={[5, 10, 15]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} projects"
            globalFilter={globalFilter}
            emptyMessage="프로젝트정보가 없습니다."
            header={header}
            totalRecords={data?.msg?.totalNumber}
            lazy
            filterDisplay="row"
            first={lazyState.first}
            onPage={onPage}
            removableSort
            onSort={onSort}
            sortField={lazyState.sortField}
            sortOrder={lazyState.sortOrder}
            onFilter={onFilter}
            filters={lazyState.filters}
            loading={isDataLoading}
          >
            <Column
              field="_id"
              header="id"
              sortable
              headerStyle={{minWidth: "12rem"}}
            ></Column>
            <Column
              field="projectname"
              header="프로젝트명"
              sortable
              headerStyle={{minWidth: "8rem"}}
            ></Column>
            <Column
              field="requestUser.email"
              header="의뢰 유저(이메일)"
              sortable
              headerStyle={{minWidth: "12rem"}}
            ></Column>
            <Column
              field="modelName"
              header="모델명"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="manufacture"
              header="제조사"
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="projectNumber"
              header="프로젝트번호"
              sortable
              headerStyle={{minWidth: "12rem"}}
            ></Column>
            <Column
              field="projectStartDate"
              header="프로젝트 시작일"
              body={localDate}
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="projectStatus"
              header="상태"
              sortable
              headerStyle={{minWidth: "8rem"}}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{minWidth: "10rem"}}
            ></Column>
          </DataTable>

          <Dialog
            visible={projectDialog}
            style={{width: "600px"}}
            header={`프로젝트정보 ${projectCreate ? "등록" : "수정"}`}
            modal
            className="p-fluid"
            footer={projectDialogFooter}
            onHide={hideDialog}
          >
            <div className="formgrid grid col-12">
              <div className="field col-6">
                <label htmlFor="projectname">프로젝트명</label>
                <InputText
                  id="projectname"
                  value={project.projectname}
                  onChange={(e) => onInputChange(e, "projectname")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !project.projectname,
                  })}
                />
                {submitted && !project.projectname && (
                  <small className="p-invalid">프로젝트명을 입력하세요</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="modelName">모델명</label>
                <InputText
                  id="modelName"
                  value={project.modelName}
                  onChange={(e) => onInputChange(e, "modelName")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !project.modelName,
                  })}
                />
                {submitted && !project.modelName && (
                  <small className="p-invalid">모델명을 입력하세요</small>
                )}
              </div>
              <div className="field col-6">
                <label htmlFor="manufacture">제조사</label>
                <InputText
                  id="manufacture"
                  value={project.manufacture}
                  onChange={(e) => onInputChange(e, "manufacture")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !project.manufacture,
                  })}
                />
                {submitted && !project.manufacture && (
                  <small className="p-invalid">제조사를 입력하세요</small>
                )}
              </div>
              <div className="field col-6">
                <label htmlFor="projectNumber">프로젝트번호</label>
                <InputText
                  id="projectNumber"
                  value={project.projectNumber}
                  onChange={(e) => onInputChange(e, "projectNumber")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !project.projectNumber,
                  })}
                />
                {submitted && !project.projectNumber && (
                  <small className="p-invalid">프로젝트 번호를 입력하세요</small>
                )}
              </div>
              <div className="field col-6">
                <label htmlFor="projectStartDate">프로젝트시작일</label>
                <Calendar
                  id="projectStartDate"
                  showIcon
                  showButtonBar
                  showTime
                  hourFormat="24"
                  value={new Date(project.projectStartDate)}
                  onChange={onDateChange}
                ></Calendar>
                {submitted && !project.projectStartDate && (
                  <small className="p-invalid">프로젝트 시작일을 입력하세요</small>
                )}
              </div>
              <div className="field col-6">
                <label htmlFor="projectStatus">프로젝트상태</label>
                <ToggleButton
                  checked={project.projectStatus}
                  onChange={onToggleSubstitution}
                  onLabel="진행"
                  offLabel="종료"
                />
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Project
