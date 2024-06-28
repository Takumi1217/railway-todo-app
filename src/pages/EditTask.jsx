// EditTask.jsx

import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { url } from '../const'
import { useHistory, useParams } from 'react-router-dom'
import './editTask.scss'

export const EditTask = () => {
  const history = useHistory()
  const { listId, taskId } = useParams()
  const [cookies] = useCookies()
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [limit, setLimit] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleLimitChange = (e) => setLimit(e.target.value)
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')

  const onUpdateTask = () => {
    const data = {
      title: title,
      detail: detail,
      limit: new Date(limit).toISOString(),
      done: isDone,
    }

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        history.push('/')
      })
      .catch((err) => {
        setErrorMessage(
          `更新に失敗しました。${err.response?.data?.ErrorMessageJP || err.message}`
        )
      })
  }

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        history.push('/')
      })
      .catch((err) => {
        setErrorMessage(
          `削除に失敗しました。${err.response?.data?.ErrorMessageJP || err.message}`
        )
      })
  }

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data
        setTitle(task.title)
        setDetail(task.detail)
        setLimit(new Date(task.limit).toISOString().slice(0, 16)) // 値を適切に設定
        setIsDone(task.done)
      })
      .catch((err) => {
        setErrorMessage(
          `タスク情報の取得に失敗しました。${err.response?.data?.ErrorMessageJP || err.message}`
        )
      })
  }, [listId, taskId, cookies.token]) // 必要な依存を追加

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <label>期限</label>
          <br />
          <input
            type="datetime-local"
            onChange={handleLimitChange}
            className="edit-task-limit"
            value={limit} // 値を適切に設定
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
