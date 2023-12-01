import './App.css';
import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/navbar';
import Navbar from './components/navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';

function App() {
  return (
    <>
      <Navbar />
      <h1>Hello</h1>
      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/login' element={ <Login /> }/>
        <Route path='/register' element={ <Register /> }/>
      </Routes>
    </>
  );
}

export default App;
