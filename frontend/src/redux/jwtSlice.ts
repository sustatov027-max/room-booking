import { createSlice, type PayloadAction } from "@reduxjs/toolkit"


interface JWTState  {
    token: string | null
}

const initialState: JWTState = {
    token: null,
}

export const jwtSlice = createSlice({
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
export default jwtSlice.reducer