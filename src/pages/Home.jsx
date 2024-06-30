import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Header } from '../components/Header'
import { url } from '../const'
import './home.scss'
import PropTypes from 'prop-types' // 追加

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo') // todo->未完了 done->完了
  const [lists, setLists] = useState([])
  const [selectListId, setSelectListId] = useState()
  const [tasks, setTasks] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies] = useCookies()

  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value)

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
  }, [cookies.token])

  useEffect(() => {
    const listId = lists[0]?.id
    if (typeof listId !== 'undefined') {
      setSelectListId(listId)
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks)
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`)
        })
    }
  }, [lists, cookies.token])

  const handleSelectList = (id) => {
    setSelectListId(id)
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks)
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`)
      })
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowLeft') {
      const prevIndex = index > 0 ? index - 1 : lists.length - 1
      handleSelectList(lists[prevIndex].id)
    } else if (e.key === 'ArrowRight') {
      const nextIndex = index < lists.length - 1 ? index + 1 : 0
      handleSelectList(lists[nextIndex].id)
    }
  }

  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new">リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`}>
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul className="list-tab" role="tablist">
            {lists.map((list, index) => {
              const isActive = list.id === selectListId
              return (
                <li
                  key={index}
                  className={`list-tab-item ${isActive ? 'active' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleSelectList(list.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  {list.title}
                </li>
              )
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new">タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

const Tasks = ({ tasks, selectListId, isDoneDisplay }) => {
  if (tasks === null) return <></>

  const filteredTasks = tasks.filter(
    (task) => task.done === (isDoneDisplay === 'done')
  )

  return (
    <ul>
      {filteredTasks.map((task, key) => {
        const deadline = new Date(task.limit)
        const now = new Date()
        const nowUTC = new Date(
          Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
          )
        )
        const deadlineUTC = new Date(
          Date.UTC(
            deadline.getUTCFullYear(),
            deadline.getUTCMonth(),
            deadline.getUTCDate(),
            deadline.getUTCHours(),
            deadline.getUTCMinutes(),
            deadline.getUTCSeconds()
          )
        )

        const remainingTime = deadlineUTC.getTime() - nowUTC.getTime()
        const daysRemaining = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
        const hoursRemaining = Math.floor(
          (remainingTime / (1000 * 60 * 60)) % 24
        )
        const minutesRemaining = Math.floor((remainingTime / 1000 / 60) % 60)

        const formatDate = (date) => {
          const pad = (num) => num.toString().padStart(2, '0')
          return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}Z`
        }

        return (
          <li key={key} className="task-item">
            <Link
              to={`/lists/${selectListId}/tasks/${task.id}`}
              className="task-item-link"
            >
              {task.title}
              <br />
              期限: {formatDate(deadlineUTC)}
              <br />
              残り: {daysRemaining}日 {hoursRemaining}時間 {minutesRemaining}分
              <br />
              {task.done ? '完了' : '未完了'}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  selectListId: PropTypes.string.isRequired,
  isDoneDisplay: PropTypes.string.isRequired,
}
