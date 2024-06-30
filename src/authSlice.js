// authSlice.js

import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'  // js-cookie をインポート

const initialState = {
  isSignIn: Cookies.get('token') !== undefined,  // 修正: Cookies から token を取得
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
      Cookies.remove('token')  // サインアウト時に token を削除
    },
  },
})

export const { signIn, signOut } = authSlice.actions
