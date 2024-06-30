// authSlice.js

import { createSlice } from '@reduxjs/toolkit'

// 初期状態の `isSignIn` を直接設定
const initialState = {
  isSignIn: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state) => {
      state.isSignIn = true
    },
    signOut: (state) => {
      state.isSignIn = false
    },
  },
})

export const { signIn, signOut } = authSlice.actions
