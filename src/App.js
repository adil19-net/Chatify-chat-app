import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Register from './pages/Register';
import Login from './pages/Login'
import AuthProvider from './context/auth';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar/>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='/register' element={<Register/>} />
        <Route exact path='/login' element={<Login/>} />
        <Route exact path='/profile' element={<Profile/>} />

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
