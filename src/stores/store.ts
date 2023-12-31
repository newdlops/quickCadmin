/* eslint-disable @typescript-eslint/no-unsafe-return */
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { ConfigureStoreOptions } from '@reduxjs/toolkit'

import { api } from '../services/api'
import loginSlice from "@/stores/reducers/loginSlice"

export const createStore = (
  options?: ConfigureStoreOptions,
) =>
  configureStore({
    reducer: {
      login: loginSlice,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
