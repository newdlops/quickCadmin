"use client"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable, DataTableStateEvent, DataTableValueArray } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { classNames } from "primereact/utils"
import React, { useRef, useState } from "react"
import { useGetLaboratorysQuery, useUpdateLaboratoryMutation, useCreateLaboratoryMutation } from '@/services/laboratory'
// import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton'

export interface ILaboratory {
  [index:string|number]:string|undefined;
  _id?: string;
  laboratoryName: string;
  laboratoryEngName: string;
  telephoneNumber: string;
  address: string;
  homepageUrl: string;
  workScope: string;
  description: string;
}

const Laboratory = () => {
  const emptyLaboratory: ILaboratory = {
    _id: "",
    laboratoryName: "",
    laboratoryEngName: "",
    telephoneNumber: "",
    address: "",
    homepageUrl: "",
    workScope: "",
    description: "",
  }
  const [lazyState, setLazyState] = useState<DataTableStateEvent>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'id',
    sortOrder: 1,
    filters: {},
    multiSortMeta: [],
  })

  const [laboratorys, setLaboratorys] = useState<ILaboratory[]>([])
  const [laboratoryDialog, setLaboratoryDialog] = useState(false)
  const [laboratoryCreate, setLaboratoryCreate] = useState(false)
  // const [deleteLaboratoryDialog, setDeleteLaboratoryDialog] = useState(false)
  // const [deleteLaboratorysDialog, setDeleteLaboratorysDialog] = useState(false)
  const [laboratory, setLaboratory] = useState<ILaboratory>(emptyLaboratory)
  // const [selectedLaboratorys, setSelectedLaboratorys] = useState<DataTableCellSelection<DataTableValueArray>>([] as unknown as DataTableCellSelection<DataTableValueArray>)
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<DataTableValueArray>>(null)
  const { data, isLoading, refetch } = useGetLaboratorysQuery({ page: lazyState.page, itemsPerPage: lazyState.rows, sortField: lazyState.sortField, sortOrder: lazyState.sortOrder, globalFilter: globalFilter })
  const [ updateLaboratory, {isLoading: isUpdating} ] = useUpdateLaboratoryMutation()
  const [ createLaboratory, {isLoading: isCreating} ] = useCreateLaboratoryMutation()
  const isDataLoading = isLoading || isUpdating || isCreating
  const tableData = (data?.msg.laboratorys) ?? ([] as DataTableValueArray)
  const openNew = () => {
    setLaboratory(emptyLaboratory)
    setLaboratoryCreate(true)
    setSubmitted(false)
    setLaboratoryDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setLaboratoryCreate(false)
    setLaboratoryDialog(false)
  }

  // const hideDeleteLaboratoryDialog = () => {
  //   setDeleteLaboratoryDialog(false)
  // }

  // const hideDeleteLaboratorysDialog = () => {
  //   setDeleteLaboratorysDialog(false)
  // }

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

  // const onSelectionChange = (e: DataTableSelectionCellChangeEvent<DataTableValueArray>) => {
  //   setSelectedLaboratorys(e.value)
  // }

  const saveLaboratory = () => {
    setSubmitted(true)

    if (laboratory.laboratoryName.trim()) {
      const _laboratorys = [...laboratorys]
      const _laboratory = { ...laboratory }
      if (laboratory._id) {
        const index = findIndexById(laboratory._id)

        _laboratorys[index] = _laboratory
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "시험소 정보가 업데이트되었습니다.",
          life: 3000,
        })
        updateLaboratory(_laboratory).catch(e=>console.log(e))
      } else {
        _laboratorys.push(_laboratory)
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "시험소가 생성되었습니다.",
          life: 3000,
        })
        delete _laboratory._id
        createLaboratory(_laboratory).catch(e=>console.log(e))
      }
      setLaboratorys(_laboratorys)
      setLaboratoryDialog(false)
      setLaboratoryCreate(false)
      setLaboratory(emptyLaboratory)
    }
  }

  const editLaboratory = (_laboratory: ILaboratory) => {
    setLaboratory({ ..._laboratory })
    setLaboratoryDialog(true)
  }

  // const confirmDeleteLaboratory = (_laboratory: Laboratory) => {
  //   setLaboratory(_laboratory)
  //   // setDeleteLaboratoryDialog(true)
  // }

  // const laboratoryDelete = () => {
  //   deleteLaboratory(laboratory?._id??'').catch(e=>console.log(e))
  //   const _laboratorys = laboratorys.filter((val) => val._id !== laboratory._id)
  //   setLaboratorys(_laboratorys)
  //   setDeleteLaboratoryDialog(false)
  //   setLaboratory(emptyLaboratory)
  //   toast.current?.show({
  //     severity: "success",
  //     summary: "작업성공",
  //     detail: "시험소가 삭제되었습니다.",
  //     life: 3000,
  //   })
  // }

  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < laboratorys.length; i++) {
      if (laboratorys[i]._id === id) {
        index = i
        break
      }
    }

    return index
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  // const confirmDeleteSelected = () => {
  //   setDeleteLaboratorysDialog(true)
  // }

  // const deleteSelectedLaboratorys = () => {
  //   deleteLaboratorys(selectedLaboratorys.map((laboratory:Laboratory)=>laboratory._id)).catch(e=>console.log(e))
  //   setLaboratorys(selectedLaboratorys as unknown as Laboratory[])
  //   setDeleteLaboratorysDialog(false)
  //   setSelectedLaboratorys([])
  //   toast.current?.show({
  //     severity: "success",
  //     summary: "Successful",
  //     detail: "선택한 시험소가 삭제되었습니다.",
  //     life: 3000,
  //   })
  // }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _laboratory = { ...laboratory }
    _laboratory[`${name}`] = val

    setLaboratory(_laboratory)
  }

  // const onToggleDelete = (
  //   e: ToggleButtonChangeEvent,
  // ) => {
  //   const _laboratory = { ...laboratory, isDelete: e.value}
  //   setLaboratory(_laboratory)
  // }

  const leftToolbarTemplate = () => (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="신규시험소등록"
          icon="pi pi-plus"
          severity="success"
          className=" mr-2"
          onClick={openNew}
        />
        {/* <Button
          label="시험소삭제"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedLaboratorys}
        /> */}
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

  const actionBodyTemplate = (rowData: ILaboratory) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => editLaboratory(rowData)}
      />
      {/* <Button
        icon="pi pi-trash"
        rounded
        severity="warning"
        onClick={() => confirmDeleteLaboratory(rowData)}
      /> */}
    </>
  )

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">시험소관리</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="검색"
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="검색어를 입력하세요..."
        />
      </span>
    </div>
  )

  const laboratoryDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={hideDialog} />
      <Button label={laboratoryCreate?"등록":"수정"} icon="pi pi-check" text onClick={saveLaboratory} />
    </>
  )
  // const deleteLaboratoryDialogFooter = (
  //   <>
  //     <Button
  //       label="아니오"
  //       icon="pi pi-times"
  //       text
  //       onClick={hideDeleteLaboratoryDialog}
  //     />
  //     <Button label="예" icon="pi pi-check" text onClick={laboratoryDelete} />
  //   </>
  // )
  // const deleteLaboratorysDialogFooter = (
  //   <>
  //     <Button
  //       label="아니오"
  //       icon="pi pi-times"
  //       text
  //       onClick={hideDeleteLaboratorysDialog}
  //     />
  //     <Button
  //       label="예"
  //       icon="pi pi-check"
  //       text
  //       onClick={deleteSelectedLaboratorys}
  //     />
  //   </>
  // )

  const dialogField = (field: string, label: string, invalidMessage: string) => (
    <div className="field">
      <label htmlFor={field}>{label}</label>
      <InputText
        id={field}
        value={laboratory[field]}
        onChange={(e) => onInputChange(e, field)}
        required
        autoFocus
        className={classNames({
          "p-invalid": submitted && !laboratory[field],
        })}
      />
      {submitted && !laboratory[field] && (
        <small className="p-invalid">{invalidMessage}</small>
      )}
    </div>)

  const dialogFieldNotRequired = (field: string, label: string) => (
    <div className="field">
      <label htmlFor={field}>{label}</label>
      <InputText
        id={field}
        value={laboratory[field]}
        onChange={(e) => onInputChange(e, field)}
        autoFocus
      />
    </div>)

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={tableData}
            // value={laboratorys}
            dataKey="_id"
            paginator
            rows={lazyState.rows}
            rowsPerPageOptions={[5, 10, 15]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            emptyMessage="등록된 시험소가 없습니다."
            header={header}
            totalRecords={data?.msg?.totalNumber}
            lazy
            filterDisplay='row'
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
              headerStyle={{ minWidth: "15rem" }}
            ></Column>
            <Column
              field="laboratoryName"
              header="시험소명"
              sortable
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="laboratoryEngName"
              header="시험소영문명(약어)"
              sortable
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="telephoneNumber"
              header="시험소전화번호"
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="address"
              header="소제지"
              sortable
              headerStyle={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="homepageUrl"
              header="홈페이지"
              sortable
              headerStyle={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="workScope"
              header="업무범위"
              sortable
              headerStyle={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="description"
              header="비고"
              sortable
              headerStyle={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={laboratoryDialog}
            style={{ width: "450px" }}
            header={`시험소정보 ${laboratoryCreate?"등록":"수정"}`}
            modal
            className="p-fluid"
            footer={laboratoryDialogFooter}
            onHide={hideDialog}
          >
            {dialogField("laboratoryName", "시험소 이름", "시험소의 이름을 입력하세요")}
            {dialogField("laboratoryEngName", "시험소 시험소 영문명", "시험소의 영문 이름(약어)를 입력해주세요")}
            {dialogField("telephoneNumber", "시험소 전화번호", "시험소의 연락처를 입력해 주세요")}
            {dialogFieldNotRequired("address", "시험소 소제지")}
            {dialogFieldNotRequired("homepageUrl", "시험소 홈페이지")}
            {dialogFieldNotRequired("workScope", "업무분장")}
            {dialogFieldNotRequired("description", "비고")}
          </Dialog>

          {/* <Dialog
            visible={deleteLaboratoryDialog}
            style={{ width: "450px" }}
            header="확인"
            modal
            footer={deleteLaboratoryDialogFooter}
            onHide={hideDeleteLaboratoryDialog}
          >
            <div className="flex align-items-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {laboratory && (
                <span>
                  <b>{laboratory.laboratoryname}</b>를 삭제하시겠습니까?
                </span>
              )}
            </div>
          </Dialog> */}

          {/* <Dialog
            visible={deleteLaboratorysDialog}
            style={{ width: "450px" }}
            header="확인"
            modal
            footer={deleteLaboratorysDialogFooter}
            onHide={hideDeleteLaboratorysDialog}
          >
            <div className="flex align-items-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {laboratory && (
                <span>
                  선택한 시험소를 정말로 삭제하시겠습니까?
                </span>
              )}
            </div>
          </Dialog> */}
        </div>
      </div>
    </div>
  )
}

export default Laboratory
