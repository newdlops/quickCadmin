import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
  name: 'loginInformation',
  initialState: { isLogin: false },
  reducers: {
    setLogin: (state, action:any) => {
      state.isLogin = action.payload
    },
  },
})

export const { setLogin } = loginSlice.actions
export default loginSlice.reducer
