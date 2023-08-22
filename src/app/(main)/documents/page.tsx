"use client"
import React, { useState, useEffect } from "react"
import { DataView, DataViewLayoutOptions } from "primereact/dataview"
import { Button } from "primereact/button"
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"
import { ProductService } from "../../../demo/service/ProductService"
import { InputText } from "primereact/inputtext"
import { Image } from "primereact/image"

import { Demo, LayoutType, SortOrderType } from "../../../types/types"

const ListDemo = () => {
  const listValue = [
    { name: "San Francisco", code: "SF" },
    { name: "London", code: "LDN" },
    { name: "Paris", code: "PRS" },
    { name: "Istanbul", code: "IST" },
    { name: "Berlin", code: "BRL" },
    { name: "Barcelona", code: "BRC" },
    { name: "Rome", code: "RM" },
  ]

  const [picklistSourceValue, setPicklistSourceValue] = useState(listValue)
  const [picklistTargetValue, setPicklistTargetValue] = useState([])
  const [orderlistValue, setOrderlistValue] = useState(listValue)
  const [dataViewValue, setDataViewValue] = useState<Demo.Product[]>([])
  const [globalFilterValue, setGlobalFilterValue] = useState("")
  const [filteredValue, setFilteredValue] = useState<Demo.Product[]>([])
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState<SortOrderType>(0)
  const [sortField, setSortField] = useState("")

  const sortOptions = [
    { label: "오름차순", value: "!price" },
    { label: "내림차순", value: "price" },
  ]

  useEffect(() => {
    ProductService.getProducts().then((data) => {
      setDataViewValue(data)
      setFilteredValue(data)
    })
    setGlobalFilterValue("")
  }, [])

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGlobalFilterValue(value)
    if (value.length === 0) {
      setFilteredValue([])
    }
    if (!dataViewValue) {
      setFilteredValue([])
    } else {
      console.log(dataViewValue)
      const filtered = dataViewValue.filter((product) => product.name.toLowerCase().includes(value))
      setFilteredValue(filtered)
    }
  }

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value

    if (value.indexOf("!") === 0) {
      setSortOrder(-1)
      setSortField(value.substring(1, value.length))
      setSortKey(value)
    } else {
      setSortOrder(1)
      setSortField(value)
      setSortKey(value)
    }
  }

  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="문서명으로 정렬"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onFilter}
          placeholder="Search by Name"
        />
      </span>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value as LayoutType)}
      />
    </div>
  )

  const dataviewListItem = (data: Demo.Product) => (
    <div className="col-12">
      <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
        <Image
          src={`/layout/images/documents/docsampleimg.jpg`}
          // src={`/demo/images/product/${data.image}`}
          alt={data.name}
          className="my-4 md:my-0 w-9 md:w-5rem shadow-2 mr-5"
          preview
          width='60'
          height='80'
        />
        {/* <img
          // src={`/demo/images/product/${data.image}`}
          src={`/layout/images/documents/docsampleimg.jpg`}
          alt={data.name}
          className="my-4 md:my-0 w-9 md:w-5rem shadow-2 mr-5"
        /> */}
        <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
          {/* <div className="font-bold text-2xl">{data.name}</div>
          <div className="mb-2">{data.description}</div> */}
          <div className="text-2xl font-bold">전지 용도확인서</div>
          <div className="mb-2">전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요</div>
        </div>
        <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
          <Button
            icon="pi pi-pencil"
            label="수정"
            className="mb-2 p-button-sm"
          ></Button>
        </div>
      </div>
    </div>
  )

  const dataviewGridItem = (data: Demo.Product) => (
    <div className="col-12 lg:col-4">
      <div className="card m-3 border-1 surface-border">
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
          {/* <div className="flex align-items-center">
            <i className="pi pi-tag mr-2" />
            <span className="font-semibold">{data.category}</span>
          </div> */}
          {/* <span
            className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}
          >
            {data.inventoryStatus}
          </span> */}
        </div>
        <div className="flex flex-column align-items-center text-center mb-3">
          <Image
            src={`/layout/images/documents/docsampleimg.jpg`}
            // src={`/demo/images/product/${data.image}`}
            alt={data.name}
            className="w-11 shadow-2 my-3 mx-0"
            preview
            width='300'
            height='400'
          />
          {/* <div className="text-2xl font-bold">{data.name}</div>
          <div className="mb-3">{data.description}</div> */}
          <div className="text-2xl font-bold">전지 용도확인서</div>
          <div className="mb-3">전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요전지의 용도를 확인할 수 있는 문서에요</div>
        </div>
        <div className="flex align-items-center justify-content-end">
          {/* <span className="text-2xl font-semibold">${data.price}</span> */}
          <Button
            label='수정'
            icon="pi pi-pencil"
          />
        </div>
      </div>
    </div>
  )

  const itemTemplate = (data: Demo.Product, layout: LayoutType) => {
    if (!data) {
      return
    }

    if (layout === "list") {
      return dataviewListItem(data)
    } else if (layout === "grid") {
      return dataviewGridItem(data)
    }
  }

  return (
    <div className="grid list-demo">
      <div className="col-12">
        <div className="card">
          <h5>문서관리</h5>
          <DataView
            value={filteredValue || dataViewValue}
            layout={layout}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
          ></DataView>
        </div>
      </div>
    </div>
  )
}

export default ListDemo
