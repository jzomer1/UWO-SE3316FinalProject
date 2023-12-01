import { useState } from 'react'

export default function Signup() {
    const [data, setData] = useState ({
        email: '',
        nickname: '',
        password: ''
    })

    const signup = (e) => {
        // prevent page from automatically loading
        e.preventDefault()
    }
    return (
        <div>
            <form onSubmit={signup}>
                <h2>Create Account</h2>
                <input type="email" id="email" placeholder="Enter email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} required />
                <input type="text" id="nickname" placeholder="Enter nickname" value={data.nickname} onChange={(e) => setData({...data, nickname: e.target.value})} required />
                <input type="password" id="password" placeholder="Enter password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} required />
                <button>Create Account</button>
            </form>
        </div>
    )
}
