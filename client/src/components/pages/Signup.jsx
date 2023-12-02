import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
    const navigate = useNavigate()

    const [data, setData] = useState ({
        email: '',
        nickname: '',
        password: ''
    })

    const signup = async (e) => {
        // prevent page from automatically loading
        e.preventDefault()

        const {email, nickname, password} = data
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    nickname,
                    password,
                }),
            });
        
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
            } else {
                console.error('Error:', response.statusText);
            }

            if (!data.error) {
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
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
            <br/>
            <Link to="/login">Go to login</Link>
        </div>
    )
}
