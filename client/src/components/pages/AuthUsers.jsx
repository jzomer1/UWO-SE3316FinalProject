import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/userContext';
import SearchHeroes from '../SearchHeroes'
import CreateLists from '../CreateLists';

export default function AuthUsers() {
    const { user } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.nickname}!</h2>
      ) : (
        <p>Loading...</p>
      )}
      <Link to="/change-password">Change Password</Link>
      <br/><br/>
      <SearchHeroes />
      <CreateLists />
    </div>
  )
}
