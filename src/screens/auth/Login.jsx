import React from 'react'
import callApi from '../../apis/handleapi'

const Login = () => {

  const handleCallApi = async() => {
    try {
        const res = await callApi('/hello');
        alert(res.message);
    } catch (e) {
        console.log(e)
    }
  }  
  return (
    <div>
        <button onClick={handleCallApi}>Login</button>
    </div>
  )
}

export default Login