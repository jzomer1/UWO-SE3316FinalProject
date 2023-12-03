import './App.css';
import './index.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import ChangePassword from './components/pages/ChangePassword';
import AuthUsers from './components/pages/AuthUsers';
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
        <Route path='/change-password' element={ <ChangePassword /> }/>
        <Route path='/authenticated-users' element={ <AuthUsers /> }/>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
