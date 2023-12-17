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
import {useCreateWrongInformationMutation, useGetWrongInformationsQuery, useUpdateWrongInformationMutation} from "@/services/wronginfo"
import {InputTextarea} from "primereact/inputtextarea"
import {IUser} from "@/app/(main)/user/page"
import {IProduct} from "@/app/(main)/product/page"

export interface IWrongInformation {
  _id?: string;
  title: string;
  content: string;
  productName: string
  requestUser?: IUser | undefined
  product?: IProduct | undefined
  reply: string
  [index: string | number]: IUser | IProduct | string | number | boolean | Date | undefined;
}

const WrongInformation = () => {
  const emptyWrongInformation: IWrongInformation = {
    _id: "",
    title: "",
    content: "",
    requestUser: undefined,
    product: undefined,
    reply: "",
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

  const [wrongInformations, setWrongInformations] = useState<IWrongInformation[]>([])
  const [wrongInformationDialog, setWrongInformationDialog] = useState(false)
  const [wrongInformationCreate, setWrongInformationCreate] = useState(false)
  const [wrongInformation, setWrongInformation] = useState<IWrongInformation>(emptyWrongInformation)
  const [selectedWrongInformations, setSelectedWrongInformations] = useState<DataTableCellSelection<DataTableValueArray>>([])
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<DataTableValueArray>>(null)
  const {data, isLoading, refetch} = useGetWrongInformationsQuery({
    page: lazyState.page,
    itemsPerPage: lazyState.rows,
    sortField: lazyState.sortField,
    sortOrder: lazyState.sortOrder,
    globalFilter: globalFilter,
  })
  const [updateWrongInformation, {isLoading: isUpdating}] = useUpdateWrongInformationMutation()
  const [createWrongInformation, {isLoading: isCreating}] = useCreateWrongInformationMutation()
  const isDataLoading = isLoading || isUpdating || isCreating
  const tableData = (data?.msg.wrongInformations) ?? ([] as DataTableValueArray)
  const openNew = () => {
    setWrongInformation(emptyWrongInformation)
    setWrongInformationCreate(true)
    setSubmitted(false)
    setWrongInformationDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setWrongInformationCreate(false)
    setWrongInformationDialog(false)
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
    setSelectedWrongInformations(e.value)
  }

  const saveWrongInformation = () => {
    setSubmitted(true)

    if (wrongInformation.title.trim()) {
      const _projects = [...wrongInformations]
      const _project = {...wrongInformation}
      if (wrongInformation._id) {
        const index = findIndexById(wrongInformation._id)

        _projects[index] = _project
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "잘못된 정보 신고내역이 업데이트되었습니다.",
          life: 3000,
        })
        updateWrongInformation(_project).catch(e => console.log(e))
      } else {
        _projects.push(_project)
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "잘못된 정보 신고내역이 생성되었습니다.",
          life: 3000,
        })
        delete _project._id
        createWrongInformation(_project).then(() => {
          tableData.length < 1 && refetch().catch(e => console.log(e))
        }).catch(e => console.log(e))
      }
      setWrongInformations(_projects)
      setWrongInformationDialog(false)
      setWrongInformationCreate(false)
      setWrongInformation(emptyWrongInformation)
    }
  }
  const onToggleSubstitution = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _project = {...wrongInformation, projectStatus: e.value}
    setWrongInformation(_project)
  }
  const editWrongInformation = (_project: IWrongInformation) => {
    setWrongInformation({..._project})
    setWrongInformationDialog(true)
  }
  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < wrongInformations.length; i++) {
      if (wrongInformations[i]._id === id) {
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
    const _project = {...wrongInformation}
    _project[`${name}`] = val

    setWrongInformation(_project)
  }

  const onDateChange = (
    e: CalendarChangeEvent,
  ) => {
    setWrongInformation({...wrongInformation, projectStartDate: new Date(e.value as string)})
  }
  const leftToolbarTemplate = () => (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="등록"
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

  const actionBodyTemplate = (rowData: IWrongInformation) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => editWrongInformation(rowData)}
      />
    </>
  )

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">제보내역 관리</h5>
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
      <Button label={wrongInformationCreate ? "등록" : "수정"} icon="pi pi-check" text onClick={saveWrongInformation}/>
    </>
  )

  const localDate = (rowData: IWrongInformation) => new Date(rowData.projectStartDate).toLocaleString()
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
            emptyMessage="제보내역이 없습니다."
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
              field="product"
              header="제품ID"
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
            visible={wrongInformationDialog}
            style={{width: "600px"}}
            header={`제보내용 ${wrongInformationCreate ? "등록" : "수정"}`}
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
                  value={wrongInformation.title}
                  onChange={(e) => onInputChange(e, "title")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !wrongInformation.title,
                  })}
                />
                {submitted && !wrongInformation.title && (
                  <small className="p-invalid">제목을 입력하세요</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="content">제보내용</label>
                <InputTextarea
                  id="content"
                  value={wrongInformation.content}
                  onChange={(e) => onInputChange(e, "content")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !wrongInformation.content,
                  })}
                />
                {submitted && !wrongInformation.content && (
                  <small className="p-invalid">내용을 입력하세요</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="reply">답변내용</label>
                <InputTextarea
                  id="reply"
                  value={wrongInformation.reply}
                  onChange={(e) => onInputChange(e, "reply")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !wrongInformation.reply,
                  })}
                />
                {submitted && !wrongInformation.reply && (
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

export default WrongInformation
