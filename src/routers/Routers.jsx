import React from 'react'
import AuthRouter from './AuthRouter'
import MainRouter from './MainRouter'

const Routers = () => {
  return (
    // isLogin ? <AuthRouter /> : <MainRouter /> -> dùng để check login hay chưa để các bạn quyết định trả về component nào
    <AuthRouter />
  )
}

export default Routers