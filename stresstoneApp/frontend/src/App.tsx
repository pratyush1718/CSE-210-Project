import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import axios from 'axios';
import Discuss from './pages/DiscussPage';
import Header from './components/Header';
import Sider from './components/Sider';
import TonePlayer from './components/TonePlayer';
import Login from './components/Login';
import Register from './components/Register';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage.tsx';
import ToneCreationPage from './pages/TonecreationPage.tsx';

const siderWidth = 240;
const headerHeight = 64;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [footerHeight, setFooterHeight] = useState(120); // Default expanded height

  useEffect(() => {
    axios.get('http://localhost:3000/')
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <CssBaseline />
      {isAuthenticated ? (
        <>
          <Header height={headerHeight} />
          <Box sx={{ display: 'flex', marginTop: `${headerHeight}px`, marginBottom: `${footerHeight}px` }}>
            <Sider drawerWidth={siderWidth} />
            <Box component="main" sx={{ p: 2, width: `calc(100% - ${siderWidth}px)`, height: '100%', overflow: 'auto' }}>
              <Routes>
                {/* These routes are accessible only after login */}
                <Route path="/" element={<Discuss />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/toneCreation" element={<ToneCreationPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
          </Box>
          <TonePlayer onHeightChange={setFooterHeight} />
        </>
      ) : (
        //if not authenticated, only these routes are available
        <>
          <Routes>
            <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
