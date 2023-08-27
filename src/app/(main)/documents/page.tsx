"use client"
import React, { useState, useRef } from "react"
import { DataView, DataViewLayoutOptions } from "primereact/dataview"
import { Button } from "primereact/button"
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { Image } from "primereact/image"
import { classNames } from "primereact/utils"
import { Dialog } from "primereact/dialog"
import { LayoutType } from "../../../types/types"
import { InputTextarea } from "primereact/inputtextarea"
import { Toast } from "primereact/toast"
import FileUpLoadComponent from '@/components/fileupload'
import { useCreateDocumentMutation, useGetDocumentsQuery, useUpdateDocumentMutation } from '@/services/document'
import { DataTableStateEvent, DataTableValueArray } from 'primereact/datatable'

export interface Document {
  [key: string]: string | number | boolean | undefined ;
  _id?:string;
  documentName: string;
  description: string;
  imageUrl: string;
}

const DocumentList = () => {
  const emptyDocument: Document = {
    _id: "",
    documentName: "",
    description: "",
    imageUrl: "",
  }
  const [lazyState, setLazyState] = useState<DataTableStateEvent>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'documentName',
    sortOrder: 1,
    filters: {},
    multiSortMeta: [],
  })
  const [document, setDocument] = useState<Document>(emptyDocument)

  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [isOpenDocumentDialog, setOpenDocumentDialog] = useState(false)
  const [isCreate, setCreate] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { data, isLoading, refetch } = useGetDocumentsQuery({ page: lazyState.page, itemsPerPage: lazyState.rows, sortField: lazyState.sortField, sortOrder: lazyState.sortOrder, globalFilter: globalFilter })
  const [ updateDocument, {isLoading: isUpdating} ] = useUpdateDocumentMutation()
  const [ createDocument, {isLoading: isCreating} ] = useCreateDocumentMutation()
  const isDataLoading = isLoading || isUpdating || isCreating
  const dataValue = (data?.msg.documents) ?? ([] as DataTableValueArray)

  const sortOptions = [
    { label: "오름차순", value: 1 },
    { label: "내림차순", value: -1 },
  ]

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGlobalFilter(value)
  }

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value
    setLazyState({ ...lazyState, sortOrder: value })
  }

  const openCreateDocumentDialog = () => {
    setCreate(true)
    setOpenDocumentDialog(true)
  }

  const openEditDocumentDialog = (_document: Document) => {
    setCreate(false)
    setDocument(_document)
    setOpenDocumentDialog(true)
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _document = { ...document }
    _document[`${name}`] = val

    setDocument(_document)
  }


  const onFileUpload = () => {
    toast.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
      life: 3000,
    })
  }

  const hideDialog = () => {
    setSubmitted(false)
    setCreate(false)
    setOpenDocumentDialog(false)
  }

  const createOrEditDocument = () => {
    setSubmitted(true)
    const _document = { ...document }
    if(isCreate){
      toast.current?.show({
        severity: "success",
        summary: "작업성공",
        detail: "문서가 생성되었습니다.",
        life: 3000,
      })
      delete _document._id
      createDocument(_document).catch(e=>console.log(e))
    } else {
      toast.current?.show({
        severity: "success",
        summary: "작업성공",
        detail: "문서가 업데이트되었습니다.",
        life: 3000,
      })
      updateDocument(_document).catch(e=>console.log(e))
    }

    setDocument(emptyDocument)
    hideDialog()
  }

  //view part
  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
      <div className="flex flex-row justify-content-between align-itmes-center gap-4">
        <Dropdown
          value={lazyState.sortOrder}
          options={sortOptions}
          optionLabel="label"
          placeholder="문서명으로 정렬"
          onChange={onSortChange}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={onFilter}
            placeholder="문서명으로 검색"
          />
        </span>
        <Button
          icon="pi pi-file-edit"
          label="신규문서 등록"
          className="p-button"
          onClick={openCreateDocumentDialog}
        ></Button>
      </div>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value as LayoutType)}
      />
    </div>
  )

  const dataviewListItem = (rowData: Document) => (
    <div className="col-12">
      <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
        <Image
          src={`/layout/images/documents/noimg.gif`}
          alt={rowData.documentName}
          className="my-4 md:my-0 w-9 md:w-5rem shadow-2 mr-5"
          preview
          width='60'
          height='80'
        />
        <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
          <div className="font-bold text-2xl">{rowData.documentName}</div>
          <div className="mb-2">{rowData.description}</div>
        </div>
        <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
          <Button
            icon="pi pi-pencil"
            label=""
            outlined
            className="mb-2 p-button-sm p-button-rounded"
            onClick={()=>openEditDocumentDialog(rowData)}
          ></Button>
        </div>
      </div>
    </div>
  )

  const dataviewGridItem = (rowData: Document) => (
    <div className="col-12 lg:col-4">
      <div className="card m-3 border-1 surface-border">
        <div className="flex flex-column align-items-center text-center mb-3">
          <Image
            src={`/layout/images/documents/noimg.gif`}
            alt={rowData.documentName}
            className="w-11 shadow-2 my-3 mx-0"
            preview
            width='300'
            height='400'
          />
          <div className="text-2xl font-bold">{rowData.documentName}</div>
          <div className="mb-3">{rowData.description}</div>
        </div>
        <div className="flex align-items-center justify-content-end">
          <Button
            label='수정'
            icon="pi pi-pencil"
            onClick={()=>openEditDocumentDialog(rowData)}
          />
        </div>
      </div>
    </div>
  )

  const itemTemplate = (data: Document, layout: LayoutType) => {
    if (!data) {
      return
    }

    if (layout === "list") {
      return dataviewListItem(data)
    } else if (layout === "grid") {
      return dataviewGridItem(data)
    }
  }

  const toast = useRef<Toast>(null)

  const documentDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="저장" icon="pi pi-check" text onClick={createOrEditDocument}/>
    </>
  )

  return (
    <div className="grid list-demo">
      <div className="col-12">
        <div className="card">
          <h5>문서관리</h5>
          <DataView
            // value={filteredValue || dataViewValue}
            value={dataValue}
            layout={layout}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rows={6}
            sortOrder={lazyState.sortOrder}
            sortField={lazyState.sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
            loading={isDataLoading}
          ></DataView>
        </div>
      </div>
      <Dialog
        visible={isOpenDocumentDialog}
        style={{ width: "1000px" }}
        header={`문서 세부사항 ${isCreate?'등록':'수정'}`}
        modal
        className="p-fluid"
        footer={documentDialogFooter}
        onHide={hideDialog}
      >
        {(
          <Image
            src={`/layout/images/documents/noimg.gif`}
            alt={document.documentName}
            className="mt-0 col-5 mb-5 block shadow-2"
            preview
            width='100%'
          />
        )}
        <div className="field">
          <label htmlFor="name">문서명</label>
          <InputText
            id="name"
            value={document.documentName}
            onChange={(e) => onInputChange(e, "documentName")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !document.documentName,
            })}
          />
          {submitted && !document.documentName && (
            <small className="p-invalid">문서명은 필수값입니다.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="description">내용설명</label>
          <InputTextarea
            id="description"
            value={document.description}
            onChange={(e) => onInputChange(e, "description")}
            required
            rows={3}
            cols={20}
          />
        </div>
        <div className='col-12'>
          <h5>문서파일 업로드</h5>
          <FileUpLoadComponent />
        </div>
      </Dialog>
    </div>
  )
}

export default DocumentList
