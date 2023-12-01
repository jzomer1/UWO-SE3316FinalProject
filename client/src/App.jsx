import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';

function App() {
  return (
    <>
      <Navbar />
      <h1>Hello</h1>
      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/login' element={ <Login /> }/>
        <Route path='/signup' element={ <Signup /> }/>
      </Routes>
    </>
  );
}

export default App;
