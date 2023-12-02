import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <div id="about">
        <h1>About</h1>
        <p>This site allows a user to search for superheroes based on name, race, publisher, or power. 
            Once logged into an account and verified, additional features become available such as creating custom lists and adding reviews. 
        </p>
      </div>
      <Link to="/login">Go to login</Link>
    </div>
  )
}
