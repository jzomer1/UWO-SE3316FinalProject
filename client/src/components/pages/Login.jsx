import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate()
  const [data, setData] = useState ({
    email: '',
    password: ''
  })

  const [error, setError] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    const {email, password} = data
    try {
      const response = await fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email,
              password,
          }),
      });
  
      if (response.ok) {
          const responseData = await response.json();
          console.log('Response data:', responseData);

          if (responseData.error) {
            console.log(responseData.error)
          } else {
            setData({});
            navigate('/');
          }
      } else {
          console.error('Error:', response.statusText);
      }
      
  } catch (error) {
      console.log(error)
    }
    setError('Incorrect login credentials');
  };

  return (
    <div>
      <form onSubmit={login}>
        <h2>Log In</h2>
        <input
          type="email"
          id="login-email"
          placeholder="Enter email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
        <input
          type="password"
          id="login-password"
          placeholder="Enter password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
        />
        <button>Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br/>
      <Link to="/signup">Create new account</Link>
    </div>
  );
}
