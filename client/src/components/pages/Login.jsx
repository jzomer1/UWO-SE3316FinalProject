import { useState } from "react"

export default function Login() {
  const [data, setData] = useState ({
    email: '',
    password: ''
  })

  const login = (e) => {
    // prevent page from automatically loading
    e.preventDefault()
  }

  return (
    <div>
      <form onSubmit={login}>
        <h2>Log In</h2>
        <input type="email" id="login-email" placeholder="Enter email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} required />
        <input type="password" id="login-password" placeholder="Enter password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} required />
        <button>Log In</button>
      </form>
    </div>
  )
}
