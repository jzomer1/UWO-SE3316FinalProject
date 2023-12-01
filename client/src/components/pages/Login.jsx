import React, { useState } from "react"

export default function Login() {
  const [data, setData] = useState ({
    email: '',
    password: ''
  })

  const [error, setError] = useState(null);

  const login = (e) => {
    e.preventDefault();
    fetch(`/test`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`not found`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response for debugging
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        setError(`Error: ${error.message}`);
      });
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
