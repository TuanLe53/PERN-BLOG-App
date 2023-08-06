import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout'
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from "./utils/PrivateRoute";
import "rsuite/dist/rsuite-no-reset.min.css";
import './App.css'
import Upload from './pages/UpPage/Upload';
import Post from './pages/Post/Post';
import UserProfile from './pages/UserProfile/UserProfile';
import Edit from './pages/EditPage/Edit';

function App() {

  return (
    <BrowserRouter>
      
      <AuthProvider>
        <Routes>
          
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/post/:post_id' element={<Post />} />
            <Route path='/profile/:user_id' element={<PrivateRoute component={UserProfile} />} />
            <Route path='/upload' element={<PrivateRoute component={Upload} />} />
            <Route path='/edit/:post_id' element={<PrivateRoute component={Edit} />} />
          </Route>

          <Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App
