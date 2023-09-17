import React, {useState} from "react"
import {Dialog} from "primereact/dialog"
import {Column} from "primereact/column"
import {DataTable, DataTableStateEvent, DataTableValueArray} from "primereact/datatable"
import {useGetProjectsQuery} from "@/services/project"
import {IProject} from "@/app/(main)/project/page"
import {Button} from "primereact/button"
import {InputText} from "primereact/inputtext"

const ProjectListDialog = ({visible, onHide, onSelect}) => {
  const [lazyState, setLazyState] = useState<DataTableStateEvent>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: '',
    sortOrder: 1,
    filters: {},
    multiSortMeta: [],
  })

  const [globalFilter, setGlobalFilter] = useState<string>("")
  const {data, isLoading} = useGetProjectsQuery({
    page: lazyState.page,
    itemsPerPage: lazyState.rows,
    sortField: lazyState.sortField,
    sortOrder: lazyState.sortOrder,
    globalFilter: globalFilter,
  }, {skip: !visible})

  const tableData = (data?.msg.projects) ?? ([] as DataTableValueArray)

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
  const localDate = (rowData: IProject) => new Date(rowData.projectStartDate).toLocaleString()
  const [selectedProject, setSelectedProject] = useState()
  const onSelectionChange = (e) => {
    setSelectedProject(e.value)
  }

  const onSelectButtonClick = () => {
    onSelect(selectedProject)
    onHide()
  }

  const projectDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={onHide}/>
      <Button label="선택" icon="pi pi-check" text onClick={onSelectButtonClick}/>
    </>
  )

  const header = (
    <div className="col-5">
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

  return <Dialog
    visible={visible}
    style={{width: "80%"}}
    header={`프로젝트 선택`}
    modal
    className="p-fluid"
    onHide={onHide}
    footer={projectDialogFooter}
  >
    <DataTable
      value={tableData}
      selection={selectedProject}
      onSelectionChange={onSelectionChange}
      cellSelection
      selectionMode={null}
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
      // filterDisplay="row"
      first={lazyState.first}
      onPage={onPage}
      removableSort
      onSort={onSort}
      sortField={lazyState.sortField}
      sortOrder={lazyState.sortOrder}
      onFilter={onFilter}
      filters={lazyState.filters}
      loading={isLoading}
    >
      <Column
        selectionMode="single"
        headerStyle={{width: "4rem"}}
      ></Column>
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
    </DataTable>
  </Dialog>

}


export default ProjectListDialog
