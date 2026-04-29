import { configureStore } from '@reduxjs/toolkit'
import jwtReducer from "./jwtSlice"
import userReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    jwt: jwtReducer,
    user: userReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

