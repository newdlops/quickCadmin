import React, {useEffect, useState} from "react"
import {Calendar, CalendarChangeEvent} from "primereact/calendar"
import {ToggleButton, ToggleButtonChangeEvent} from "primereact/togglebutton"
import {Button} from "primereact/button"
import {InputText} from "primereact/inputtext"
import {classNames} from "primereact/utils"
import {Dropdown} from "primereact/dropdown"

const ProjectItem = ({data, onClickEdit}) => {
  const [projectItem, setProjectItem] = useState(data)
  useEffect(() => {
    setProjectItem(data)
  },[data])
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _projectItem = {...projectItem}
    _projectItem[`${name}`] = val

    setProjectItem(_projectItem)
  }

  const dropdownValues = [
    { name: '준비단계', value: 1 },
    { name: '시험대기', value: 2 },
    { name: '시험중', value: 3 },
    { name: '성적서 작성중', value: 4 },
    { name: '성적서 완료', value: 5 },
    { name: '인증완료', value: 6 },
    { name: '완료', value: 7 },
  ]

  const onDateChange = (
    e: CalendarChangeEvent,
  ) => {
    setProjectItem({...projectItem, checkdate: new Date(e.value as string)})
  }

  const onToggle = (
    e: ToggleButtonChangeEvent,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || false
    const _projectItem = {...projectItem}
    _projectItem[`${name}`] = val
    setProjectItem(_projectItem)
  }

  const onEdit = () => {
    onClickEdit(data)
  }
  const projectItemStatusChange = (e) => {
    setProjectItem({...projectItem, processedStage: e.value})
  }
  return <div className="grid col-12">
    <div className="formgrid grid card col-12">
      <FormFeid className="field col-3" feildName="projectItemName" label="세부항목" invalidMsg="세부항목을 입력하세요"
        valueObj={projectItem} onInputChange={onInputChange} disabled/>
      <div className="field col-3 h-3rem">
        <label htmlFor="status">진행단계</label>
        <Dropdown
          id="status"
          className="field h-3rem"
          value={parseInt(projectItem.processedStage)}
          onChange={projectItemStatusChange}
          options={dropdownValues}
          optionLabel="name"
          placeholder="진행단계를 선택하세요"
          readOnly
        />
      </div>
      <FormFeid className="field col-3" feildName="description" label="비고" invalidMsg="세부항목을 입력하세요"
        valueObj={projectItem} onInputChange={onInputChange} disabled/>
      <div className="field col-3">
        <label htmlFor="status">상태</label>
        <ToggleButton
          checked={projectItem.status}
          onChange={e => onToggle(e, "status")}
          onLabel="완료"
          offLabel="진행중"
          disabled
        />
      </div>
      <div className="field col-3">
        <label htmlFor="sample">시료 확인</label>
        <ToggleButton
          checked={projectItem.sample}
          onChange={e => onToggle(e, "sample")}
          onLabel="확인"
          offLabel="미확인"
          disabled
        />
      </div>
      <div className="field col-3">
        <label htmlFor="document">문서 준비</label>
        <ToggleButton
          checked={projectItem.document}
          onChange={e => onToggle(e, "document")}
          onLabel="완료"
          offLabel="준비중"
          disabled
        />
      </div>
      <div className="field col-6">
        <label htmlFor="checkdate">견적 확인일</label>
        <Calendar
          id="checkdate"
          showIcon
          showButtonBar
          showTime
          hourFormat="24"
          value={new Date(projectItem.checkdate)}
          onChange={onDateChange}
          disabled
        ></Calendar>
        {!projectItem.checkdate && (
          <small className="p-invalid">견적 확인일을 입력하세요</small>
        )}
      </div>
      <div className="formgrid col-offset-10 col-2">
        <Button label="수정" icon="pi pi-pencil" onClick={onEdit}/>
      </div>
    </div>
  </div>
}
const FormFeid = ({className, label, invalidMsg, valueObj, feildName, onInputChange, disabled}) => {
  return <div className={className}>
    <label htmlFor="projectItemName">{label}</label>
    <InputText
      id="projectItemName"
      value={valueObj[feildName]}
      onChange={(e) => onInputChange(e, feildName)}
      required
      autoFocus
      disabled={disabled}
      className={classNames({
        "p-invalid": !valueObj[feildName],
      })}
    />
    {!valueObj[feildName] && (
      <small className="p-invalid">{invalidMsg}</small>
    )}
  </div>
}

export default ProjectItem
