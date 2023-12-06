import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/userContext';
import SearchHeroes from '../SearchHeroes'
import CreateLists from '../CreateLists';

const fetchUsers = async () => {
  const response = await fetch('/emails');
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`Error fetching users: ${response.statusText}`);
  }
};

export default function AuthUsers() {
  const { user, grantAdminPrivilege } = useContext(UserContext);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the list of users and update state
    fetchUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  console.log('User context:', user);
  console.log('Admin status:', user ? user.isAdmin : null);

  const handleGrantAdmin = () => {
    console.log('Before Granting Admin - Selected User Email:', selectedUserEmail);
    if (selectedUserEmail) {
      console.log('Selected User Email:', selectedUserEmail);
      grantAdminPrivilege(selectedUserEmail);
  } else {
      alert('Please select a user to grant admin');
  }
  };
  console.log('User:', user);

  return (
    <div>
      {loading ? (
        <p>loading...</p>
      ) : user ? (
        <>
        <h2>Welcome, {user.nickname}!</h2>
        {user.isAdmin && <p>You have admin privileges</p>}
        {user && user.isAdmin && (
            <>
            <select
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setSelectedUserEmail(e.target.value);
              }}
              value={selectedUserId || ''}
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>

            <button onClick={handleGrantAdmin}>Grant Admin</button>
            <br/><br/>
            </>
          )}
        </>
      ) : null
      }
      <Link to="/change-password">Change password</Link>
      <br/>
      <Link to="/login">Switch account</Link>
      <br/><br/>
      <SearchHeroes />
      <CreateLists />
    </div>
  )
}
