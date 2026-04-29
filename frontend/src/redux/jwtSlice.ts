import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface JwtState {
  token: string | null
}

const initialState: JwtState = {
  token: null,
}

const jwtSlice = createSlice({
  name: 'jwt',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    clearToken: (state) => {
      state.token = null
    },
  },
})

export const { setToken, clearToken } = jwtSlice.actions
export const selectToken = (state: { jwt: JwtState }) => state.jwt.token
export default jwtSlice.reducer