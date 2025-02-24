import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sider from './components/Sider';
import { Box, CssBaseline } from '@mui/material';
import TonePlayer from './components/TonePlayer';
import Login from './components/Login';
import { Route, Routes } from 'react-router-dom';
import PageLayout from './pages/PageLayout'
import UploadPage from './pages/UploadPage';


function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/')
      .then((res) => setMessage(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Routes>
        <Route path='/' element={<PageLayout />} >
            <Route index={true} element={<Login/>} />
            <Route path='/upload' element={<UploadPage/>} />
        </Route>
    </Routes>
  );
}

export default App;
