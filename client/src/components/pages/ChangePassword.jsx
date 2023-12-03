import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ChangePassword() {
    const [data, setData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    
      const [error, setError] = useState(null);
      const [successMessage, setSuccessMessage] = useState('');
    
      const handleChangePassword = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = data;
    
        if (newPassword !== confirmPassword) {
          setError("New password and confirm password do not match");
          return;
        }
    
        try {
          const response = await fetch("/change-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          });
    
          if (response.ok) {
            const responseData = await response.json();
            console.log("Password change response:", responseData);
    
            if (responseData.error) {
              setError(responseData.error);
              setSuccessMessage('');
            } else {
              setData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setError(null);
              setSuccessMessage('Password changed successfully');
            }
          } else {
            console.error("Error:", response.statusText);
            setError("Failed to change password");
            setSuccessMessage('');
          }
        } catch (error) {
          console.log(error);
          setError("Error changing password");
          setSuccessMessage('');
        }
      };

  return (
    <div>
      <form>
        <h2>Change Password</h2>
        <input
          type="password"
          id="current-password"
          placeholder="Current Password"
          value={data.currentPassword}
          onChange={(e) => setData({ ...data, currentPassword: e.target.value })}
          required
        />
        <input
          type="password"
          id="new-password"
          placeholder="New Password"
          value={data.newPassword}
          onChange={(e) => setData({ ...data, newPassword: e.target.value })}
          required
        />
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
          required
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <br/>
      <Link to="/authenticated-users">Return</Link>
    </div>
  )
}
