import { combineReducers } from 'redux'
import loginReducer from './loginSlice'

const rootReducer = combineReducers({
  login: loginReducer,
})

export default rootReducer
