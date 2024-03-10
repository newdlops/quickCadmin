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
import {useCreateFaqMutation, useGetFaqsQuery, useUpdateFaqMutation} from "@/services/faq"
import {InputTextarea} from "primereact/inputtextarea"

export interface IFaq {
  _id?: string;
  question: string;
  answer: string;
  [index: string | number]: string | number | boolean | Date | undefined;
}

const Faq = () => {
  const emptyFaq: IFaq = {
    _id: "",
    question: "",
    answer: "",
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

  const [faqs, setFaqs] = useState<IFaq[]>([])
  const [faqDialog, setFaqDialog] = useState(false)
  const [faqCreate, setFaqCreate] = useState(false)
  const [faq, setFaq] = useState<IFaq>(emptyFaq)
  // @ts-ignore
  const [selectedFaqs, setSelectedFaqs] = useState<DataTableCellSelection<DataTableValueArray>>([])
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<DataTableValueArray>>(null)
  const {data, isLoading, refetch} = useGetFaqsQuery({
    page: lazyState.page,
    itemsPerPage: lazyState.rows,
    sortField: lazyState.sortField,
    sortOrder: lazyState.sortOrder,
    globalFilter: globalFilter,
  })
  const [updateFaq, {isLoading: isUpdating}] = useUpdateFaqMutation()
  const [createFaq, {isLoading: isCreating}] = useCreateFaqMutation()
  const isDataLoading = isLoading || isUpdating || isCreating
  const tableData = (data?.msg.faqs) ?? ([] as DataTableValueArray)
  const openNew = () => {
    setFaq(emptyFaq)
    setFaqCreate(true)
    setSubmitted(false)
    setFaqDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setFaqCreate(false)
    setFaqDialog(false)
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
    setSelectedFaqs(e.value)
  }

  const saveFaq = () => {
    setSubmitted(true)

    if (faq.question.trim()) {
      const _projects = [...faqs]
      const _project = {...faq}
      if (faq._id) {
        const index = findIndexById(faq._id)

        _projects[index] = _project
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "Faq 정보가 업데이트되었습니다.",
          life: 3000,
        })
        updateFaq(_project).catch(e => console.log(e))
      } else {
        _projects.push(_project)
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "Faq정보가 생성되었습니다.",
          life: 3000,
        })
        delete _project._id
        createFaq(_project).then(() => {
          tableData.length < 1 && refetch().catch(e => console.log(e))
        }).catch(e => console.log(e))
      }
      setFaqs(_projects)
      setFaqDialog(false)
      setFaqCreate(false)
      setFaq(emptyFaq)
    }
  }
  const onToggleSubstitution = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _project = {...faq, projectStatus: e.value}
    setFaq(_project)
  }
  const editFaq = (_faq: IFaq) => {
    setFaq({..._faq})
    setFaqDialog(true)
  }
  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < faqs.length; i++) {
      if (faqs[i]._id === id) {
        index = i
        break
      }
    }

    return index
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _faq = {...faq}
    _faq[`${name}`] = val

    setFaq(_faq)
  }

  const onDateChange = (
    e: CalendarChangeEvent,
  ) => {
    setFaq({...faq, faqStartDate: new Date(e.value as string)})
  }
  const leftToolbarTemplate = () => (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="Faq등록"
          icon="pi pi-plus"
          severity="success"
          className=" mr-2"
          onClick={openNew}
        />
      </div>
    </React.Fragment>
  )

  const actionBodyTemplate = (rowData: IFaq) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => editFaq(rowData)}
      />
    </>
  )

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Faq관리</h5>
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

  const faqDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={hideDialog}/>
      <Button label={faqCreate ? "등록" : "수정"} icon="pi pi-check" text onClick={saveFaq}/>
    </>
  )

  // @ts-ignore
  const localDate = (rowData: IFaq) => new Date(rowData.projectStartDate).toLocaleString()
  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast}/>
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
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
            emptyMessage="등록된 Faq가 없습니다."
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
              field="question"
              header="질문"
              sortable
              headerStyle={{minWidth: "12rem"}}
            ></Column>
            <Column
              field="answer"
              header="답변"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{minWidth: "10rem"}}
            ></Column>
          </DataTable>

          <Dialog
            visible={faqDialog}
            style={{width: "600px"}}
            header={`Faq ${faqCreate ? "등록" : "수정"}`}
            modal
            className="p-fluid"
            footer={faqDialogFooter}
            onHide={hideDialog}
          >
            <div className="formgrid grid col-12">
              <div className="field col-6">
                <label htmlFor="title">질문</label>
                <InputText
                  id="title"
                  value={faq.question}
                  onChange={(e) => onInputChange(e, "question")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !faq.question,
                  })}
                />
                {submitted && !faq.question && (
                  <small className="p-invalid">질문을 입력하세요</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="answer">답변</label>
                <InputTextarea
                  id="answer"
                  value={faq.answer}
                  onChange={(e) => onInputChange(e, "answer")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !faq.answer,
                  })}
                />
                {submitted && !faq.answer && (
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

export default Faq
