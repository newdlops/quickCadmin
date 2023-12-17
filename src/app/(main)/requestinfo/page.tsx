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
import {ToggleButton, ToggleButtonChangeEvent} from 'primereact/togglebutton'
import {Calendar, CalendarChangeEvent} from "primereact/calendar"
import {useCreateRequestInformationMutation, useGetRequestInformationsQuery, useUpdateRequestInformationMutation} from "@/services/requestinfo"
import {InputTextarea} from "primereact/inputtextarea"

export interface IRequestInformation {
  _id?: string;
  title: string;
  content: string;
  [index: string | number]: string | number | boolean | Date | undefined;
}

const RequestInformation = () => {
  const emptyRequestInformation: IRequestInformation = {
    _id: "",
    title: "",
    content: "",
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

  const [requestInformations, setRequestInformations] = useState<IRequestInformation[]>([])
  const [requestInformationDialog, setRequestInformationDialog] = useState(false)
  const [requestInformationCreate, setRequestInformationCreate] = useState(false)
  const [requestInformation, setRequestInformation] = useState<IRequestInformation>(emptyRequestInformation)
  const [selectedRequestInformations, setSelectedRequestInformations] = useState<DataTableCellSelection<DataTableValueArray>>([])
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<DataTableValueArray>>(null)
  const {data, isLoading, refetch} = useGetRequestInformationsQuery({
    page: lazyState.page,
    itemsPerPage: lazyState.rows,
    sortField: lazyState.sortField,
    sortOrder: lazyState.sortOrder,
    globalFilter: globalFilter,
  })
  const [updateRequestInformation, {isLoading: isUpdating}] = useUpdateRequestInformationMutation()
  const [createRequestInformation, {isLoading: isCreating}] = useCreateRequestInformationMutation()
  const isDataLoading = isLoading || isUpdating || isCreating
  const tableData = (data?.msg.requestInformations) ?? ([] as DataTableValueArray)
  const openNew = () => {
    setRequestInformation(emptyRequestInformation)
    setRequestInformationCreate(true)
    setSubmitted(false)
    setRequestInformationDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setRequestInformationCreate(false)
    setRequestInformationDialog(false)
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
    setSelectedRequestInformations(e.value)
  }

  const saveRequestInformation = () => {
    setSubmitted(true)

    if (requestInformation.title.trim()) {
      const _projects = [...requestInformations]
      const _project = {...requestInformation}
      if (requestInformation._id) {
        const index = findIndexById(requestInformation._id)

        _projects[index] = _project
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "프로젝트 정보가 업데이트되었습니다.",
          life: 3000,
        })
        updateRequestInformation(_project).catch(e => console.log(e))
      } else {
        _projects.push(_project)
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "프로젝트정보가 생성되었습니다.",
          life: 3000,
        })
        delete _project._id
        createRequestInformation(_project).then(() => {
          tableData.length < 1 && refetch().catch(e => console.log(e))
        }).catch(e => console.log(e))
      }
      setRequestInformations(_projects)
      setRequestInformationDialog(false)
      setRequestInformationCreate(false)
      setRequestInformation(emptyRequestInformation)
    }
  }
  const onToggleSubstitution = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _project = {...requestInformation, projectStatus: e.value}
    setRequestInformation(_project)
  }
  const editRequestInformation = (_project: IRequestInformation) => {
    setRequestInformation({..._project})
    setRequestInformationDialog(true)
  }
  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < requestInformations.length; i++) {
      if (requestInformations[i]._id === id) {
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
    const _project = {...requestInformation}
    _project[`${name}`] = val

    setRequestInformation(_project)
  }

  const onDateChange = (
    e: CalendarChangeEvent,
  ) => {
    setRequestInformation({...requestInformation, projectStartDate: new Date(e.value as string)})
  }
  const leftToolbarTemplate = () => (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="신규공지등록"
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

  const actionBodyTemplate = (rowData: IRequestInformation) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => editRequestInformation(rowData)}
      />
    </>
  )

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">공지사항관리</h5>
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
      <Button label={requestInformationCreate ? "등록" : "수정"} icon="pi pi-check" text onClick={saveRequestInformation}/>
    </>
  )

  const localDate = (rowData: IRequestInformation) => new Date(rowData.projectStartDate).toLocaleString()
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
            emptyMessage="공지사항이 없습니다."
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
              field="title"
              header="제목"
              sortable
              headerStyle={{minWidth: "12rem"}}
            ></Column>
            <Column
              field="productName"
              header="제품명"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="content"
              header="내용"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="reply"
              header="답변"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="requestUser"
              header="요청자"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{minWidth: "10rem"}}
            ></Column>
          </DataTable>

          <Dialog
            visible={requestInformationDialog}
            style={{width: "600px"}}
            header={`공지사항 ${requestInformationCreate ? "등록" : "수정"}`}
            modal
            className="p-fluid"
            footer={projectDialogFooter}
            onHide={hideDialog}
          >
            <div className="formgrid grid col-12">
              <div className="field col-6">
                <label htmlFor="title">제목</label>
                <InputText
                  id="title"
                  value={requestInformation.title}
                  onChange={(e) => onInputChange(e, "title")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !requestInformation.title,
                  })}
                />
                {submitted && !requestInformation.title && (
                  <small className="p-invalid">제목을 입력하세요</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="content">요청사항</label>
                <InputTextarea
                  id="content"
                  value={requestInformation.content}
                  onChange={(e) => onInputChange(e, "content")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !requestInformation.content,
                  })}
                />
                {submitted && !requestInformation.content && (
                  <small className="p-invalid">내용을 입력하세요</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="reply">답변내용</label>
                <InputTextarea
                  id="reply"
                  value={requestInformation.reply}
                  onChange={(e) => onInputChange(e, "reply")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !requestInformation.reply,
                  })}
                />
                {submitted && !requestInformation.reply && (
                  <small className="p-invalid">답변을 입력하세요</small>
                )}
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default RequestInformation
