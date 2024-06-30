// NotFound.jsx

import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Not Found</h1>
      <p>お探しのページが見つかりませんでした。</p>
      <Link to="/" className="not-found-link">
        ホームに戻る
      </Link>
    </div>
  )
}
