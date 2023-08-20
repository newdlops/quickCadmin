"use client"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { FileUpload } from "primereact/fileupload"
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton"
import { Rating } from "primereact/rating"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { classNames } from "primereact/utils"
import React, { useEffect, useRef, useState } from "react"
import { ProductService } from "./ProductService"
import { Demo } from '../../../types/demo'
import { useLazyGetUsersQuery, useGetUsersQuery } from '@/services/user'

interface User {
  _id?: string;
  username: string;
  password: string;
}

const User = () => {
  const emptyUser: User = {
    _id: "",
    username: "",
    password: "",
  }
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 2,
    page: 0,
    sortField: '',
    sortOrder: 1,
    filters: {},
  })
  
  const [users, setUsers] = useState<User[]>([])
  const [productDialog, setProductDialog] = useState(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState(false)
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)
  const [user, setUser] = useState<User>(emptyUser)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<User[]>>(null)
  const { data, error, isLoading } = useGetUsersQuery({ page: lazyState.page, itemsPerPage: lazyState.rows, sortField: lazyState.sortField, sortOrder: lazyState.sortOrder, globalFilter: globalFilter })

  useEffect(() => {
    console.log(data?.msg, globalFilter)
  }, [])

  const openNew = () => {
    setUser(emptyUser)
    setSubmitted(false)
    setProductDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false)
  }

  const onPage = (event) => {
    setLazyState(event)
  }

  const onSort = (event) => {
    setLazyState(event)
  }

  const onFilter = (event) => {
    console.log('onfilter', event)
    event['first'] = 0
    setLazyState(event)
  }

  const saveProduct = () => {
    setSubmitted(true)

    if (user.name.trim()) {
      const _products = [...users]
      const _product = { ...user }
      if (user.id) {
        const index = findIndexById(user.id)

        _products[index] = _product
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        })
      } else {
        _product.id = createId()
        _product.image = "product-placeholder.svg"
        _products.push(_product)
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        })
      }

      setUsers(_products)
      setProductDialog(false)
      setUser(emptyUser)
    }
  }

  const editProduct = (product: User) => {
    setUser({ ...product })
    setProductDialog(true)
  }

  const confirmDeleteProduct = (product: User) => {
    setUser(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = () => {
    const _products = users.filter((val) => val.id !== user.id)
    setUsers(_products)
    setDeleteProductDialog(false)
    setUser(emptyUser)
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    })
  }

  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        index = i
        break
      }
    }

    return index
  }

  const createId = () => {
    let id = ""
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true)
  }

  const deleteSelectedProducts = () => {
    const _products = users.filter((val) => !selectedUsers?.includes(val))
    setUsers(_products)
    setDeleteProductsDialog(false)
    setSelectedUsers([])
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    })
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _product = { ...user }
    _product[`${name}`] = val

    setUser(_product)
  }

  const onInputNumberChange = (
    e: InputNumberValueChangeEvent,
    name: string,
  ) => {
    const val = e.value || 0
    const _product = { ...user }
    _product[`${name}`] = val

    setUser(_product)
  }

  const leftToolbarTemplate = () => (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="신규유저등록"
          icon="pi pi-plus"
          severity="success"
          className=" mr-2"
          onClick={openNew}
        />
        <Button
          label="유저삭제"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedUsers || !selectedUsers.length}
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

  const actionBodyTemplate = (rowData: User) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => editProduct(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        severity="warning"
        onClick={() => confirmDeleteProduct(rowData)}
      />
    </>
  )

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">유저관리</h5>
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

  const productDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="적용" icon="pi pi-check" text onClick={saveProduct} />
    </>
  )
  const deleteProductDialogFooter = (
    <>
      <Button
        label="아니오"
        icon="pi pi-times"
        text
        onClick={hideDeleteProductDialog}
      />
      <Button label="예" icon="pi pi-check" text onClick={deleteProduct} />
    </>
  )
  const deleteProductsDialogFooter = (
    <>
      <Button
        label="아니오"
        icon="pi pi-times"
        text
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="예"
        icon="pi pi-check"
        text
        onClick={deleteSelectedProducts}
      />
    </>
  )

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
            value={data?.msg?.users}
            selection={selectedUsers}
            onSelectionChange={(e) =>
              setSelectedUsers(e.value as User[])
            }
            resizableColumns
            dataKey="_id"
            paginator
            rows={lazyState.rows}
            rowsPerPageOptions={[5, 10, 15]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            emptyMessage="유저가 없습니다."
            header={header}
            totalRecords={data?.msg?.totalNumber}
            lazy
            filterDisplay='row'
            first={lazyState.first}
            onPage={onPage}
            removableSort
            onSort={onSort}
            sortField={lazyState.sortField}
            sortOrder={lazyState.sortOrder as 0|1|-1}
            onFilter={onFilter}
            filters={lazyState.filters}
            loading={isLoading as boolean}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>
            <Column
              field="_id"
              header="id"
              sortable
              headerStyle={{ minWidth: "15rem" }}
            ></Column>
            <Column
              field="username"
              header="UserName"
              sortable
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="password"
              header="Password"
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="isDelete"
              header="Deleted"
              sortable
              headerStyle={{ minWidth: "5rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={productDialog}
            style={{ width: "450px" }}
            header="유저정보 입력"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="name">이름</label>
              <InputText
                id="name"
                value={user.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.name,
                })}
              />
              {submitted && !user.name && (
                <small className="p-invalid">이름을 입력하세요</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="name">이메일</label>
              <InputText
                id="name"
                value={user.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.name,
                })}
              />
              {submitted && !user.name && (
                <small className="p-invalid">이메일을 입력하세요</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="name">패스워드</label>
              <InputText
                id="name"
                value={user.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.name,
                })}
              />
              {submitted && !user.name && (
                <small className="p-invalid">패스워드를 입력하세요</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="확인"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="flex align-items-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  <b>{user.name}</b>를 삭제하시겠습니까?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: "450px" }}
            header="확인"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="flex align-items-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  선택한 유저를 정말로 삭제하시겠습니까?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default User
