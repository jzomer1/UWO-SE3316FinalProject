import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/userContext';
import SearchHeroes from '../SearchHeroes'

export default function AuthUsers() {
    const { user } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <p>Welcome, {user.nickname}!</p>
      ) : (
        <p>Loading...</p>
      )}
      <Link to="/change-password">Change Password</Link>
      <SearchHeroes />
    </div>
  )
}
