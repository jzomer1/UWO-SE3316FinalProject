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
              setUser(data);
            })
            .catch(error => {
              console.error('Fetch error:', error.message);
            });
        }
      }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}