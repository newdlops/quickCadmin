"use client"
import { useRouter } from "next/navigation"
import React, {useContext, useEffect, useState} from "react"
import { Button } from "primereact/button"
import { Password } from "primereact/password"
import { LayoutContext } from "../../../../layout/context/layoutcontext"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import {useLazyAdminLoginQuery} from "@/services/user"
import {setLogin} from "@/stores/reducers/loginSlice"
import {useDispatch, useSelector} from "react-redux"

const LoginPage = () => {
  const dispatch = useDispatch()
  // const isLogin = useSelector(state => state.login.isLogin)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [checked, setChecked] = useState(false)
  const { layoutConfig } = useContext(LayoutContext)
  const [adminlogin, {data, isLoading, isSuccess}] = useLazyAdminLoginQuery()
  const router = useRouter()
  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" },
  )
  const adminLogin = () => {
    console.log('login')
    adminlogin({
      email: email,
      password: password,
    }).then(({ data }) => {
      // @ts-ignore
      if(data?.msg){
        // @ts-ignore
        console.log('로그인 시도 성공')
        dispatch(setLogin(true))
        router.replace('/')
      } else {
        // @ts-ignore
        console.log('로그인 시도 실패')
        dispatch(setLogin(false))
        router.replace('/auth/access')
      }
    })
  }

  return (
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >

            <div>
              <label
                htmlFor="adminid"
                className="block text-900 text-xl font-medium mb-2"
              >
                아이디
              </label>
              <InputText
                id="adminid"
                type="text"
                placeholder="아이디를 입력하세요"
                className="w-full md:w-30rem mb-5"
                value={email}
                onChange={event => setEmail(event.target.value)}
                style={{ padding: "1rem" }}
              />

              <label
                htmlFor="password1"
                className="block text-900 font-medium text-xl mb-2"
              >
                비밀번호
              </label>
              <Password
                inputId="password1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                toggleMask
                className="w-full mb-5"
                inputClassName="w-full p-3 md:w-30rem"
              ></Password>

              <Button
                label="로그인"
                className="w-full p-3 text-xl"
                onClick={adminLogin}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
