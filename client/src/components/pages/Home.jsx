import React from 'react'
import { Link } from 'react-router-dom'
import SearchHeroes from '../SearchHeroes'

export default function Home() {
  return (
    <div>
      <div id="about">
        <h2>About</h2>
        <p>This site allows a user to search for superheroes based on name, race, publisher, or power. 
            Once logged into an account and verified, additional features become available such as creating custom lists and adding reviews. 
        </p>
      </div>
      <br/>
      <Link to="/login">Go to login</Link>
      <br/><br/>
      <SearchHeroes />
    </div>
  )
}
