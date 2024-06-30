// SignUp.jsx

import axios from 'axios'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom' // useHistory の代わりに useNavigate を使用
import { signIn } from '../authSlice'
import { Header } from '../components/Header'
import { url } from '../const'
import './signUp.scss'
import { Link, Navigate } from 'react-router-dom' // Navigate と Link をインポート

export const SignUp = () => {
  const navigate = useNavigate() // useHistory の代わりに useNavigate を使用
  const auth = useSelector((state) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessge] = useState()
  const [setCookie] = useCookies(['token']) // 'token' の Cookie を使用するように修正

  const handleEmailChange = (e) => setEmail(e.target.value)
  const handleNameChange = (e) => setName(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)

  const onSignUp = () => {
    const data = { email, name, password }

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const token = res.data.token
        dispatch(signIn())
        setCookie('token', token) // token を Cookie に保存
        navigate('/') // history.push の代わりに navigate を使用
      })
      .catch((err) => {
        setErrorMessge(
          `サインアップに失敗しました。${err.response?.data?.message || err.message}`
        ) // 修正: エラーメッセージの表示
      })

    if (auth) return <Navigate to="/" /> // Redirect の代わりに Navigate を使用
  }

  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form">
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            onChange={handleEmailChange}
            value={email} // 修正: 入力値の管理
            className="email-input"
          />
          <br />
          <label>ユーザ名</label>
          <br />
          <input
            type="text"
            onChange={handleNameChange}
            value={name} // 修正: 入力値の管理
            className="name-input"
          />
          <br />
          <label>パスワード</label>
          <br />
          <input
            type="password"
            onChange={handlePasswordChange}
            value={password} // 修正: 入力値の管理
            className="password-input"
          />
          <br />
          <button type="button" onClick={onSignUp} className="signup-button">
            作成
          </button>
        </form>
        <Link to="/signin">サインイン</Link>{' '}
        {/* 修正: 新規作成ページからサインインページへのリンク */}
      </main>
    </div>
  )
}
