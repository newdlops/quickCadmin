"use client"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable, DataTableCellSelection, DataTableSelectionCellChangeEvent, DataTableStateEvent, DataTableValueArray } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { classNames } from "primereact/utils"
import React, { useRef, useState } from "react"
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useCreateUserMutation, useDeleteUsersMutation } from '@/services/user'
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton'

export interface IUser {
  [index:string|number]:string|number|boolean|undefined;
  _id?: string;
  username: string;
  email: string;
  password: string;
  accessToken: string;
  accessTokenExpiredAt: string;
  isDelete: boolean;
}

const User = () => {
  const emptyUser: IUser = {
    _id: "",
    username: "",
    password: "",
    accessToken: "",
    accessTokenExpiredAt: "",
    email: "",
    isDelete: false,
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

  const [users, setUsers] = useState<IUser[]>([])
  const [userDialog, setUserDialog] = useState(false)
  const [userCreate, setUserCreate] = useState(false)
  const [deleteUserDialog, setDeleteUserDialog] = useState(false)
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false)
  const [user, setUser] = useState<IUser>(emptyUser)
  const [selectedUsers, setSelectedUsers] = useState<DataTableCellSelection<DataTableValueArray>>([] as unknown as DataTableCellSelection<DataTableValueArray>)
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<DataTableValueArray>>(null)
  const { data, isLoading, refetch } = useGetUsersQuery({ page: lazyState.page, itemsPerPage: lazyState.rows, sortField: lazyState.sortField, sortOrder: lazyState.sortOrder, globalFilter: globalFilter })
  const [ deleteUser, {isLoading: isDeleting} ] = useDeleteUserMutation()
  const [ updateUser, {isLoading: isUpdating} ] = useUpdateUserMutation()
  const [ createUser, {isLoading: isCreating} ] = useCreateUserMutation()
  const [ deleteUsers, {isLoading: isListDeleting} ] = useDeleteUsersMutation()
  const isDataLoading = isLoading || isDeleting || isUpdating || isCreating || isListDeleting
  const tableData = (data?.msg.users) ?? ([] as DataTableValueArray)
  const openNew = () => {
    setUser(emptyUser)
    setUserCreate(true)
    setSubmitted(false)
    setUserDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setUserCreate(false)
    setUserDialog(false)
  }

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false)
  }

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false)
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
    setSelectedUsers(e.value)
  }

  const saveUser = () => {
    setSubmitted(true)

    if (user.username.trim()) {
      const _users = [...users]
      const _user = { ...user }
      if (user._id) {
        const index = findIndexById(user._id)

        _users[index] = _user
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "유저 정보가 업데이트되었습니다.",
          life: 3000,
        })
        updateUser(_user).catch(e=>console.log(e))
      } else {
        _users.push(_user)
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "유저가 생성되었습니다.",
          life: 3000,
        })
        delete _user._id
        createUser(_user).catch(e=>console.log(e))
      }
      setUsers(_users)
      setUserDialog(false)
      setUserCreate(false)
      setUser(emptyUser)
    }
  }

  const editUser = (_user: IUser) => {
    setUser({ ..._user })
    setUserDialog(true)
  }

  const confirmDeleteUser = (_user: IUser) => {
    setUser(_user)
    setDeleteUserDialog(true)
  }

  const userDelete = () => {
    deleteUser(user?._id??'').catch(e=>console.log(e))
    const _users = users.filter((val) => val._id !== user._id)
    setUsers(_users)
    setDeleteUserDialog(false)
    setUser(emptyUser)
    toast.current?.show({
      severity: "success",
      summary: "작업성공",
      detail: "유저가 삭제되었습니다.",
      life: 3000,
    })
  }

  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id === id) {
        index = i
        break
      }
    }

    return index
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true)
  }

  const deleteSelectedUsers = () => {
    deleteUsers(selectedUsers.map((user:IUser)=>user._id)).catch(e=>console.log(e))
    setUsers(selectedUsers as unknown as IUser[])
    setDeleteUsersDialog(false)
    setSelectedUsers([])
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "선택한 유저가 삭제되었습니다.",
      life: 3000,
    })
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _user = { ...user }
    _user[`${name}`] = val

    setUser(_user)
  }

  const onToggleDelete = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _user = { ...user, isDelete: e.value}
    setUser(_user)
  }

  const onToggleAdmin = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _user = { ...user, isAdmin: e.value}
    setUser(_user)
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
          disabled={!selectedUsers}
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

  const actionBodyTemplate = (rowData: IUser) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => editUser(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        severity="warning"
        onClick={() => confirmDeleteUser(rowData)}
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

  const userDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={hideDialog} />
      <Button label={userCreate?"등록":"수정"} icon="pi pi-check" text onClick={saveUser} />
    </>
  )
  const deleteUserDialogFooter = (
    <>
      <Button
        label="아니오"
        icon="pi pi-times"
        text
        onClick={hideDeleteUserDialog}
      />
      <Button label="예" icon="pi pi-check" text onClick={userDelete} />
    </>
  )
  const deleteUsersDialogFooter = (
    <>
      <Button
        label="아니오"
        icon="pi pi-times"
        text
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="예"
        icon="pi pi-check"
        text
        onClick={deleteSelectedUsers}
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
            value={tableData}
            selection={selectedUsers}
            onSelectionChange={onSelectionChange}
            cellSelection
            selectionMode='multiple'
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
            sortOrder={lazyState.sortOrder}
            onFilter={onFilter}
            filters={lazyState.filters}
            loading={isDataLoading}
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
              field="accessToken"
              header="accessToken"
              sortable
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="accessTokenExpiredAt"
              header="accessTokenExpiredAt"
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
            visible={userDialog}
            style={{ width: "450px" }}
            header={`유저정보 ${userCreate?"등록":"수정"}`}
            modal
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="username">이름</label>
              <InputText
                id="username"
                value={user.username}
                onChange={(e) => onInputChange(e, "username")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.username,
                })}
              />
              {submitted && !user.username && (
                <small className="p-invalid">이름을 입력하세요</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="email">이메일</label>
              <InputText
                id="email"
                value={user.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.email,
                })}
              />
              {submitted && !user.email && (
                <small className="p-invalid">이메일을 입력하세요</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="password">패스워드</label>
              <InputText
                id="password"
                value={user.password}
                onChange={(e) => onInputChange(e, "password")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.password,
                })}
              />
              {submitted && !user.password && (
                <small className="p-invalid">패스워드를 입력하세요</small>
              )}
            </div>
            {!userCreate&&<div className="field">
              <label htmlFor="password">삭제됨</label>
              <ToggleButton
                checked={user.isDelete}
                onChange={onToggleDelete}
                onLabel="예"
                offLabel="아니오"
              />
            </div>}
            {!userCreate&&<div className="field">
              <label htmlFor="isAdmin">관리자</label>
              <ToggleButton
                checked={user.isAdmin}
                onChange={onToggleAdmin}
                onLabel="예"
                offLabel="아니오"
              />
            </div>}
          </Dialog>

          <Dialog
            visible={deleteUserDialog}
            style={{ width: "450px" }}
            header="확인"
            modal
            footer={deleteUserDialogFooter}
            onHide={hideDeleteUserDialog}
          >
            <div className="flex align-items-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  <b>{user.username}</b>를 삭제하시겠습니까?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteUsersDialog}
            style={{ width: "450px" }}
            header="확인"
            modal
            footer={deleteUsersDialogFooter}
            onHide={hideDeleteUsersDialog}
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
