import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({})

export function UserContextProvider({children}) {
    // assume no-one is logged in
    const [user, setUser] = useState(null);

    // executes whenever a page renders
    useEffect(() => {
      if (!user) {
        fetch('/profile')
          .then(response => {
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setUser(prevUser => {
              console.log('Updated User Data:', data);
              // only update if user is different
              if (prevUser !== data) {
                return data;
              }
              return prevUser;
            });
          })
          .catch(error => {
            console.error('Fetch error:', error.message);
          });
        }
      });

      const grantAdminPrivilege = async (email) => {
        try {
          console.log('Granting Admin - Email:', email);
          const response = await fetch('/admin/grant/' + email, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
          });

          if (response.ok) {
            const profileResponse = await fetch('/profile');
            
            if (profileResponse.ok) {
                const updatedUser = await profileResponse.json();
                setUser(updatedUser);
            } else {
                const data = await profileResponse.json();
                console.error(`Error fetching updated user profile: ${data.error}`);
            }
          } else {
              const data = await response.json();
              alert(`Error granting admin privileges: ${data.error}`);
          }
        } catch (error) {
            console.error('Error granting admin privileges:', error);
            alert('Internal server error');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, grantAdminPrivilege }}>
            {children}
        </UserContext.Provider>
    )
}