import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  uuid: string | null
  name: string | null
  email: string | null
  password: string | null
  role: string | null
  createdAt: string | null
}

const initialState: UserState = {
    uuid: null,
    name: null,
    email: null,
    password: null,
    role: null,
    createdAt: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.uuid = action.payload.uuid
            state.name = action.payload.name
            state.email = action.payload.email
            state.password = action.payload.password
            state.role = action.payload.role
            state.createdAt = action.payload.createdAt
        },
        clearUser: (state) => {
            state.uuid = null
            state.name = null
            state.email = null
            state.password = null
            state.role = null
            state.createdAt = null
        }
    },
})

export const { setUser, clearUser } = userSlice.actions
export const selectUser = (state: { user: UserState }) => state.user
export default userSlice.reducer

