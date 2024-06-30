// SignIn.jsx

import React, { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'  // useHistory の代わりに useNavigate を使用
import { Header } from '../components/Header'
import './signin.scss'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../authSlice'
import { url } from '../const'
import { Link, Navigate } from 'react-router-dom'  // Navigate と Link をインポート

export const SignIn = () => {
  const auth = useSelector((state) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const navigate = useNavigate()  // useHistory の代わりに useNavigate を使用
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const [cookies, setCookie] = useCookies(['token'])  // 'token' の Cookie を使用するように修正

  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)

  const onSignIn = () => {
    axios
      .post(`${url}/signin`, { email, password })
      .then((res) => {
        setCookie('token', res.data.token)  // token を Cookie に保存
        dispatch(signIn())
        navigate('/')  // history.push の代わりに navigate を使用
      })
      .catch((err) => {
        setErrorMessage(`サインインに失敗しました。${err.response?.data?.message || err.message}`)  // 修正: エラーメッセージの表示
      })
  }

  if (auth) return <Navigate to="/" />  // Redirect の代わりに Navigate を使用

  return (
    <div>
      <Header />
      <main className="signin">
        <h2>サインイン</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signin-form">
          <label className="email-label">メールアドレス</label>
          <br />
          <input
            type="email"
            className="email-input"
            value={email}  // 修正: 入力値の管理
            onChange={handleEmailChange}
          />
          <br />
          <label className="password-label">パスワード</label>
          <br />
          <input
            type="password"
            className="password-input"
            value={password}  // 修正: 入力値の管理
            onChange={handlePasswordChange}
          />
          <br />
          <button type="button" className="signin-button" onClick={onSignIn}>
            サインイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  )
}
