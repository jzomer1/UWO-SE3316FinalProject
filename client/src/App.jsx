import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import { UserContextProvider } from './context/userContext';

function App() {
  // set <title>, [] ensures it only runs once
  React.useEffect(() => {
    document.title = 'Superhero Information';
  }, []);

  return (
    <UserContextProvider>
      <Navbar />
      <h1>Superhero Information</h1>
      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/login' element={ <Login /> }/>
        <Route path='/signup' element={ <Signup /> }/>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
