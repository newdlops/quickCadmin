"use client"
import {Button} from "primereact/button"
import {InputText} from "primereact/inputtext"
import {Toast} from "primereact/toast"
import {classNames} from "primereact/utils"
import React, { useRef, useState} from "react"
import {ToggleButton, ToggleButtonChangeEvent} from 'primereact/togglebutton'
import {Calendar, CalendarChangeEvent} from "primereact/calendar"
import ProjectListDialog from "@/app/(main)/project/projectdetail/projectListDialog"
import {Dialog} from "primereact/dialog"
import ProjectItem from "@/app/(main)/project/projectdetail/projectItem"
import {
  useCreateProjectItemMutation,
  useFindProjectItemByProjectQuery,
  useUpdateProjectItemMutation,
} from "@/services/projectitem"
import {IUser} from "@/app/(main)/user/page"
import {useUpdateProjectMutation} from "@/services/project"
import {Dropdown} from "primereact/dropdown"

export interface IProject {
  _id?: string;
  projectname: string;
  requestUser: IUser;
  modelName: string;
  manufacture: string;
  projectNumber: string;
  projectStartDate: Date;
  projectStatus: boolean;
  projectItems: Array<IProjectItem>;

  [index: string | number]: string | number | boolean | Date | any | undefined;
}

export interface IProjectItem {
  _id?: string;
  projectItemName: string;
  checkdate: Date;
  sample: boolean;
  document: boolean;
  processedStage: number;
  requestUser: string;
  status: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  project: string;
  [index: string | number]: string | number | boolean | Date | any | undefined;
}
const Project = () => {
  const emptyProject: IProject = {
    _id: "",
    projectname: "",
    requestUser: {},
    modelName: "",
    manufacture: "",
    projectNumber: "",
    projectStartDate: new Date(),
    projectStatus: false,
    projectItems: [],
  }
  const emptyProjectItem: IProjectItem = {
    _id: "",
    projectItemName: "",
    sample: false,
    checkdate: new Date(),
    document: false,
    processedStage: 1,
    requestUser: "",
    status: false,
    description: "",
    project: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const [project, setProject] = useState<IProject>(emptyProject)
  const [updateConfirmationDialog, setUpdateConfirmationDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const toast = useRef<Toast>(null)
  const [editProjectItem, showEditProjectItemDialog] = useState(false)
  const [projectItemCreate, setProjectItemCreate] = useState(false)
  const [projectItem, setProjectItem] = useState(emptyProjectItem)
  const [dropdownValue, setDropdownValue] = useState(null)

  const [updateProject] = useUpdateProjectMutation()
  const {data: projectItemList, isLoading} = useFindProjectItemByProjectQuery(project, { skip: project._id == ""})
  const [createProjectItem] = useCreateProjectItemMutation()
  const [updateProjectItem] = useUpdateProjectItemMutation()
  const onToggleSubstitution = (
    e: ToggleButtonChangeEvent,
  ) => {
    const _project = {...project, projectStatus: e.value}
    setProject(_project)
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _project = {...project}
    _project[`${name}`] = val

    setProject(_project)
  }

  const projectItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || ""
    const _projectItem = {...projectItem}
    _projectItem[`${name}`] = val

    setProjectItem(_projectItem)
  }

  const projectItemStatusChange = (e) => {
    setProjectItem({...projectItem, processedStage: e.value})
  }

  const onDateChange = (
    e: CalendarChangeEvent,
  ) => {
    setProject({...project, projectStartDate: new Date(e.value as string)})
  }

  const onProjectItemCheckDateChange = (
    e: CalendarChangeEvent,
  ) => {
    setProjectItem({...projectItem, checkdate: new Date(e.value as string)})
  }
  const [showProjectListDialog, setShowProjectListDialog] = useState(false)
  const hidedialog = () => {
    setShowProjectListDialog(false)
  }

  const addItem = () => {
    setProjectItemCreate(true)
    showEditProjectItemDialog(true)
  }
  const editItem = e => {
    setProjectItem(e)
    setProjectItemCreate(false)
    showEditProjectItemDialog(true)
  }
  const closeItemDialog = () => {
    setProjectItemCreate(false)
    showEditProjectItemDialog(false)
    setProjectItem(emptyProjectItem)
  }

  const saveProject = () => {
    console.log(project)
    if(project.projectname.trim()) {
      const _project = {...project}
      if(_project._id) {
        updateProject(_project).then(
          () => {
            toast.current?.show({
              severity: "success",
              summary: "작업성공",
              detail: "프로젝트가 업데이트되었습니다.",
              life: 3000,
            })
          },
        ).catch(e => console.log(e))
      }
    }
    setUpdateConfirmationDialog(false)
  }
  const saveProjectItem = () => {
    if (projectItem.projectItemName.trim()) {
      const _projectItem = { ...projectItem }
      if (_projectItem._id) {
        updateProjectItem(_projectItem).then(
          () =>{ toast.current?.show({
            severity: "success",
            summary: "작업성공",
            detail: "프로젝트 아이템 정보가 업데이트되었습니다.",
            life: 3000,
          })
          }).catch(e => console.log(e))
      } else {
        const _updateProjectItem = { ..._projectItem, project: project._id, requestUser: project.requestUser?._id }
        delete _updateProjectItem._id
        createProjectItem(_updateProjectItem).then(() => {
          toast.current?.show({
            severity: "success",
            summary: "작업성공",
            detail: "프로젝트 아이템 정보가 생성되었습니다.",
            life: 3000,
          })
        }).catch(e => console.log(e))
      }
      setProjectItemCreate(false)
      showEditProjectItemDialog(false)
      setProjectItem(emptyProjectItem)
    }
  }

  const projectItemDialogFooter = (
    <>
      <Button label="취소" icon="pi pi-times" text onClick={closeItemDialog}/>
      <Button label={projectItemCreate ? "생성" : "수정"} icon="pi pi-check" text onClick={saveProjectItem}/>
    </>
  )
  const showUpdateConfirmationDialog = () => {
    setUpdateConfirmationDialog(true)
  }
  const hideUpdateConfirmationDialog = () => {
    setUpdateConfirmationDialog(false)
  }

  const updateConfirmationDialogFooter = (
    <>
      <Button
        label="아니오"
        icon="pi pi-times"
        text
        onClick={hideUpdateConfirmationDialog}
      />
      <Button label="예" icon="pi pi-check" text onClick={saveProject}/>
    </>
  )

  const onToggle = (
    e: ToggleButtonChangeEvent,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || false
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

  return (
    <div className="grid p-fluid">
      <div className="grid col-12">
        <div className="formgrid grid card col-12">
          <Toast ref={toast}/>
          <ProjectListDialog visible={showProjectListDialog} onHide={hidedialog} onSelect={(e) => setProject(e)}/>
          <div className="formgrid grid col-12">
            <div className="formgrid grid field col-6 flex align-items-end">
              <div className="field col-10">
                <label htmlFor="projectname">프로젝트명</label>
                <InputText
                  id="projectname"
                  value={project.projectname}
                  onChange={(e) => onInputChange(e, "projectname")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !project.projectname,
                  })}
                />
                {submitted && !project.projectname && (
                  <small className="p-invalid">프로젝트명을 입력하세요</small>
                )}
              </div>
              <div className="field col-1">
                <Button label="" icon="pi pi-search" onClick={() => setShowProjectListDialog(!showProjectListDialog)}/>
              </div>
            </div>
            <div className="field col-6">
              <label htmlFor="projectNumber">프로젝트번호</label>
              <InputText
                id="projectNumber"
                value={project.projectNumber}
                onChange={(e) => onInputChange(e, "projectNumber")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !project.projectNumber,
                })}
              />
              {submitted && !project.projectNumber && (
                <small className="p-invalid">프로젝트 번호를 입력하세요</small>
              )}
            </div>
            <div className="field col-6">
              <label htmlFor="modelName">모델명</label>
              <InputText
                id="modelName"
                value={project.modelName}
                onChange={(e) => onInputChange(e, "modelName")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !project.modelName,
                })}
              />
              {submitted && !project.modelName && (
                <small className="p-invalid">모델명을 입력하세요</small>
              )}
            </div>
            <div className="field col-6">
              <label htmlFor="manufacture">제조사</label>
              <InputText
                id="manufacture"
                value={project.manufacture}
                onChange={(e) => onInputChange(e, "manufacture")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !project.manufacture,
                })}
              />
              {submitted && !project.manufacture && (
                <small className="p-invalid">제조사를 입력하세요</small>
              )}
            </div>
            <div className="field col-6">
              <label htmlFor="requestUser.email">의뢰자</label>
              <InputText
                id="requestUser.email"
                value={project.requestUser?.email}
                required
                autoFocus
                disabled
              />
            </div>
            <div className="field col-6">
              <label htmlFor="projectStartDate">프로젝트시작일</label>
              <Calendar
                id="projectStartDate"
                showIcon
                showButtonBar
                showTime
                hourFormat="24"
                value={new Date(project.projectStartDate)}
                onChange={onDateChange}
              ></Calendar>
              {submitted && !project.projectStartDate && (
                <small className="p-invalid">프로젝트 시작일을 입력하세요</small>
              )}
            </div>
            <div className="field col-6">
              <label htmlFor="projectStatus">프로젝트상태</label>
              <ToggleButton
                checked={project.projectStatus}
                onChange={onToggleSubstitution}
                onLabel="완료"
                offLabel="진행"
              />
            </div>
          </div>
          <div className="col-offset-8 col-2">
            <Button label="세부항목 추가" icon="pi pi-plus" onClick={addItem}/>
          </div>
          <div className="col-2">
            <Button label="변경" onClick={showUpdateConfirmationDialog}/>
          </div>
        </div>
      </div>
      {projectItemList?.msg?.map((v, i) => <ProjectItem data={v} key={i} onClickEdit={editItem}></ProjectItem>)}
      <Dialog
        visible={editProjectItem}
        style={{width: "80%"}}
        header={`세부 아이템 등록`}
        modal
        className="p-fluid"
        onHide={closeItemDialog}
        footer={projectItemDialogFooter}
      >
        <div className="formgrid grid col-12">
          <FormFeid className="field col-3" feildName="projectItemName" label="세부항목명" invalidMsg="세부항목을 입력하세요"
            valueObj={projectItem} onInputChange={projectItemChange} submitted={submitted}/>
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
            />
          </div>
          <FormFeid className="field col-3" feildName="description" label="비고" invalidMsg="세부항목을 입력하세요"
            valueObj={projectItem} onInputChange={projectItemChange} submitted={submitted}/>
          <div className="field col-3">
            <label htmlFor="status">상태</label>
            <ToggleButton
              checked={projectItem.status}
              onChange={e => onToggle(e, "status")}
              onLabel="완료"
              offLabel="진행중"
            />
          </div>
          <div className="field col-3">
            <label htmlFor="sample">시료 확인</label>
            <ToggleButton
              checked={projectItem.sample}
              onChange={e => onToggle(e, "sample")}
              onLabel="확인"
              offLabel="미확인"
            />
          </div>
          <div className="field col-3">
            <label htmlFor="document">문서 준비</label>
            <ToggleButton
              checked={projectItem.document}
              onChange={e => onToggle(e, "document")}
              onLabel="완료"
              offLabel="준비중"
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
              onChange={onProjectItemCheckDateChange}
            ></Calendar>
            {submitted && !projectItem.checkdate && (
              <small className="p-invalid">견적 확인일을 입력하세요</small>
            )}
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={updateConfirmationDialog}
        style={{width: "450px"}}
        header="확인"
        modal
        footer={updateConfirmationDialogFooter}
        onHide={hideUpdateConfirmationDialog}
      >
        <div className="flex align-items-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{fontSize: "2rem"}}
          />
          {(
            <span>
              <b>{project?.projectname}</b>를 변경하시겠습니까?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  )
}

const FormFeid = ({className, label, invalidMsg, valueObj, feildName, onInputChange, submitted}) => <div className={className}>
  <label htmlFor="projectItemName">{label}</label>
  <InputText
    id="projectItemName"
    value={valueObj[feildName]}
    onChange={(e) => onInputChange(e, feildName)}
    required
    autoFocus
    className={classNames({
      "p-invalid": !valueObj[feildName],
    })}
  />
  {submitted && !valueObj[feildName] && (
    <small className="p-invalid">{invalidMsg}</small>
  )}
</div>
export default Project


