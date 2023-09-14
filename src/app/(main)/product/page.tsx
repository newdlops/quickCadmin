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
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useDeleteProductsMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '@/services/product'
import {ToggleButton, ToggleButtonChangeEvent} from 'primereact/togglebutton'
import {InputTextarea} from "primereact/inputtextarea"
import {PickList} from "primereact/picklist"
import {useGetAllDocumentQuery} from "@/services/document"
import {RequiredDocument} from "@/app/(main)/documents/page"

export interface Product {
  [index: string | number]: string | number | boolean | RequiredDocument[] | undefined;

  _id?: string;
  productname: string;
  keyword: string;
  certificationCategory: string;
  category: string;
  substitution: boolean;
  sample: string;
  period: string;
  expectedCost: string;
  requiredDocument: RequiredDocument[];
  testingLaboratory: string;
  tip: string;
  description: string;
  isDelete: boolean;
}

const Product = () => {
  const emptyProduct: Product = {
    _id: "",
    productname: "",
    keyword: "",
    certificationCategory: "",
    category: "",
    substitution: false,
    sample: "",
    period: "",
    expectedCost: "",
    requiredDocument: [],
    testingLaboratory: "",
    tip: "",
    description: "",
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

  const [products, setProducts] = useState<Product[]>([])
  const [productDialog, setProductDialog] = useState(false)
  const [productCreate, setProductCreate] = useState(false)
  const [deleteProductDialog, setDeleteProductDialog] = useState(false)
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false)
  const [product, setProduct] = useState<Product>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<DataTableCellSelection<DataTableValueArray>>([])
  const [submitted, setSubmitted] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<DataTableValueArray>>(null)
  const {data, isLoading, refetch} = useGetProductsQuery({
    page: lazyState.page,
    itemsPerPage: lazyState.rows,
    sortField: lazyState.sortField,
    sortOrder: lazyState.sortOrder,
    globalFilter: globalFilter,
  })
  const {data: documents} = useGetAllDocumentQuery(null)
  const [deleteProduct, {isLoading: isDeleting}] = useDeleteProductMutation()
  const [updateProduct, {isLoading: isUpdating}] = useUpdateProductMutation()
  const [createProduct, {isLoading: isCreating}] = useCreateProductMutation()
  const [deleteProducts, {isLoading: isListDeleting}] = useDeleteProductsMutation()
  const isDataLoading = isLoading || isDeleting || isUpdating || isCreating || isListDeleting
  const tableData = (data?.msg.products) ?? ([] as DataTableValueArray)

  const openNew = () => {
    setProduct(emptyProduct)
    // setPicklistSourceValue(documents?.msg)
    setProductCreate(true)
    setSubmitted(false)
    setProductDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductCreate(false)
    setProductDialog(false)
    // setPicklistSourceValue(documents?.msg)
    // setPicklistTargetValue([])
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false)
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
    setSelectedProducts(e.value)
  }

  const saveProduct = () => {
    setSubmitted(true)

    if (product.productname.trim()) {
      const _products = [...products]
      const _product = {...product}
      if (product._id) {
        const index = findIndexById(product._id)

        _products[index] = _product
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "제품 정보가 업데이트되었습니다.",
          life: 3000,
        })
        updateProduct(_product).catch(e => console.log(e))
      } else {
        _products.push(_product)
        toast.current?.show({
          severity: "success",
          summary: "작업성공",
          detail: "제품정보가 생성되었습니다.",
          life: 3000,
        })
        delete _product._id
        createProduct(_product).then(() => {
          tableData.length < 1 && refetch().catch(e => console.log(e))
        }).catch(e => console.log(e))
      }
      setProducts(_products)
      setProductDialog(false)
      setProductCreate(false)
      setProduct(emptyProduct)
    }
  }

  const editProduct = (_product: Product) => {
    setProduct({..._product})
    setProductDialog(true)
  }
  const pickedListSourceList = documents?.msg.filter(doc => !product.requiredDocument.some(v => v == doc._id))
  const pickedListTargetList = documents?.msg.filter(doc => product.requiredDocument.some(v => v == doc._id))
  const onChangePickedList = (e) => {
    setProduct({...product, requiredDocument: e.target.map(v=>v._id)})
  }

  const confirmDeleteProduct = (_product: Product) => {
    setProduct(_product)
    setDeleteProductDialog(true)
  }

  const productDelete = () => {
    deleteProduct(product?._id ?? '').catch(e => console.log(e))
    const _products = products.filter((val) => val._id !== product._id)
    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
    toast.current?.show({
      severity: "success",
      summary: "작업성공",
      detail: "제품정보가 삭제되었습니다.",
      life: 3000,
    })
  }

  const findIndexById = (id: string) => {
    let index = -1
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === id) {
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
    setDeleteProductsDialog(true)
  }

  const deleteSelectedProducts = () => {
    deleteProducts(selectedProducts.map((_product: Product) => _product._id)).catch(e => console.log(e))
    setProducts(selectedProducts as unknown as Product[])
    setDeleteProductsDialog(false)
    setSelectedProducts([] as unknown as DataTableCellSelection<DataTableValueArray>)
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "선택한 제품이 삭제되었습니다.",
      life: 3000,
    })
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _product = {...product}
    _product[`${name}`] = val

    setProduct(_product)
  }

  const onToggleDelete = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _product = {...product, isDelete: e.value}
    setProduct(_product)
  }

  const onToggleSubstitution = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _product = {...product, substitution: e.value}
    setProduct(_product)
  }
  const leftToolbarTemplate = () => (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="신규제품등록"
          icon="pi pi-plus"
          severity="success"
          className=" mr-2"
          onClick={openNew}
        />
        <Button
          label="제품삭제"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts}
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

  const actionBodyTemplate = (rowData: Product) => (
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
      <h5 className="m-0">제품정보관리</h5>
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

  const productDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={hideDialog}/>
      <Button label={productCreate ? "등록" : "수정"} icon="pi pi-check" text onClick={saveProduct}/>
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
      <Button label="예" icon="pi pi-check" text onClick={productDelete}/>
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
          <Toast ref={toast}/>
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={tableData}
            selection={selectedProducts}
            onSelectionChange={onSelectionChange}
            cellSelection
            selectionMode="multiple"
            dataKey="_id"
            paginator
            rows={lazyState.rows}
            rowsPerPageOptions={[5, 10, 15]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            emptyMessage="제품정보가 없습니다."
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
              selectionMode="multiple"
              headerStyle={{width: "4rem"}}
            ></Column>
            <Column
              field="_id"
              header="id"
              sortable
              headerStyle={{minWidth: "15rem"}}
            ></Column>
            <Column
              field="productname"
              header="제품명"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="certificationCategory"
              header="인증구분"
              sortable
              headerStyle={{minWidth: "12rem"}}
            ></Column>
            <Column
              field="category"
              header="제품분류"
              sortable
              headerStyle={{minWidth: "20rem"}}
            ></Column>
            <Column
              field="substitution"
              header="대체여부"
              headerStyle={{minWidth: "8rem"}}
            ></Column>
            <Column
              field="sample"
              header="샘플"
              sortable
              headerStyle={{minWidth: "8rem"}}
            ></Column>
            <Column
              field="period"
              header="주기"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="expectedCost"
              header="예상견적가"
              sortable
              headerStyle={{minWidth: "8rem"}}
            ></Column>
            <Column
              field="testingLaboratory"
              header="시험소"
              sortable
              headerStyle={{minWidth: "8rem"}}
            ></Column>
            <Column
              field="isDelete"
              header="삭제"
              sortable
              headerStyle={{minWidth: "7rem"}}
            ></Column>
            <Column
              field="tip"
              header="팁"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              field="description"
              header="설명"
              sortable
              headerStyle={{minWidth: "10rem"}}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{minWidth: "10rem"}}
            ></Column>
          </DataTable>

          <Dialog
            visible={productDialog}
            style={{width: "1000px"}}
            header={`제품정보 ${productCreate ? "등록" : "수정"}`}
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="formgrid grid">
              <div className="formgrid grid col-6">
                <div className="field col-6">
                  <label htmlFor="productname">제품명</label>
                  <InputText
                    id="productname"
                    value={product.productname}
                    onChange={(e) => onInputChange(e, "productname")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !product.productname,
                    })}
                  />
                  {submitted && !product.productname && (
                    <small className="p-invalid">제품명을 입력하세요</small>
                  )}
                </div>
                <div className="field col-3">
                  <label htmlFor="substitution">대체가능여부</label>
                  <ToggleButton
                    checked={product.substitution}
                    onChange={onToggleSubstitution}
                    onLabel="대체가능"
                    offLabel="대체불가"
                  />
                </div>
                {!productCreate && <div className="field col-3">
                  <label htmlFor="password">삭제여부</label>
                  <ToggleButton
                    checked={product.isDelete}
                    onChange={onToggleDelete}
                    onLabel="예"
                    offLabel="아니오"
                  />
                </div>}
                <div className="field col-12">
                  <label htmlFor="certificationCategory">인증구분</label>
                  <InputText
                    id="certificationCategory"
                    value={product.certificationCategory}
                    onChange={(e) => onInputChange(e, "certificationCategory")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !product.certificationCategory,
                    })}
                  />
                  {submitted && !product.certificationCategory && (
                    <small className="p-invalid">제품의 인증종류를 입력하세요</small>
                  )}
                </div>
                <div className="field col-12">
                  <label htmlFor="category">제품분류</label>
                  <InputText
                    id="category"
                    value={product.category}
                    onChange={(e) => onInputChange(e, "category")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !product.category,
                    })}
                  />
                  {submitted && !product.category && (
                    <small className="p-invalid">제품 카테고리를 입력하세요</small>
                  )}
                </div>
                <div className="field col-6">
                  <label htmlFor="sample">샘플</label>
                  <InputText
                    id="sample"
                    value={product.sample}
                    onChange={(e) => onInputChange(e, "sample")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !product.sample,
                    })}
                  />
                  {submitted && !product.sample && (
                    <small className="p-invalid">샘플을 입력하세요</small>
                  )}
                </div>
                <div className="field col-6">
                  <label htmlFor="period">기간</label>
                  <InputText
                    id="period"
                    value={product.period}
                    onChange={(e) => onInputChange(e, "period")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !product.period,
                    })}
                  />
                  {submitted && !product.period && (
                    <small className="p-invalid">기간을 입력하세요</small>
                  )}
                </div>
              </div>
              <div className="formgrid grid col-6">
                <div className="field col-6">
                  <label htmlFor="expectedCost">예상견적가</label>
                  <InputText
                    id="expectedCost"
                    value={product.expectedCost}
                    onChange={(e) => onInputChange(e, "expectedCost")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !product.expectedCost,
                    })}
                  />
                  {submitted && !product.expectedCost && (
                    <small className="p-invalid">예상견적가를 입력하세요</small>
                  )}
                </div>
                <div className="field col-6">
                  <label htmlFor="testingLaboratory">시험소</label>
                  <InputText
                    id="testingLaboratory"
                    value={product.testingLaboratory}
                    onChange={(e) => onInputChange(e, "testingLaboratory")}
                    required
                    autoFocus
                    className={classNames({
                      "p-invalid": submitted && !product.testingLaboratory,
                    })}
                  />
                  {submitted && !product.testingLaboratory && (
                    <small className="p-invalid">시험소를 입력하세요</small>
                  )}
                </div>
              </div>
              <div className="field col-12">
                <label htmlFor="tip">팁</label>
                <InputTextarea
                  id="tip"
                  value={product.tip}
                  onChange={(e) => onInputChange(e, "tip")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !product.tip,
                  })}
                />
                {submitted && !product.tip && (
                  <small className="p-invalid">팁을 입력하세요</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="description">설명</label>
                <InputTextarea
                  id="description"
                  value={product.description}
                  onChange={(e) => onInputChange(e, "description")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !product.description,
                  })}
                />
                {submitted && !product.description && (
                  <small className="p-invalid">설명을 입력하세요</small>
                )}
              </div>
              <div className="col-12">
                <div className="card">
                  <h5>필요문서</h5>
                  <PickList
                    source={pickedListSourceList}
                    target={pickedListTargetList}
                    sourceHeader="문서목록"
                    targetHeader="문서지정"
                    itemTemplate={(item) => <div>{item.documentName}</div>}
                    onChange={onChangePickedList}
                    sourceStyle={{height: "200px"}}
                    targetStyle={{height: "200px"}}
                  ></PickList>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{width: "450px"}}
            header="확인"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="flex align-items-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{fontSize: "2rem"}}
              />
              {product && (
                <span>
                  <b>{product.productname}</b>를 삭제하시겠습니까?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{width: "450px"}}
            header="확인"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="flex align-items-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{fontSize: "2rem"}}
              />
              {product && (
                <span>
                  선택한 제품을 정말로 삭제하시겠습니까?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Product
