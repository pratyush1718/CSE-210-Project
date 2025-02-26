import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import axios from 'axios';
import SearchPage from './pages/SearchPage';
import Discuss from './pages/DiscussPage';
import Header from './components/Header';
import Sider from './components/Sider';
import TonePlayer from './components/TonePlayer';
import Login from "./components/Login";

const siderWidth = 240;
const headerHeight = 64;

function App() {
  const [_, setMessage] = useState<string>('');
  const [footerHeight, setFooterHeight] = useState(120); // Default expanded height

  useEffect(() => {
    axios.get('http://localhost:3000/')
      .then((res) => setMessage(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <CssBaseline />
      <Header height={headerHeight} />
      <Box sx={{ display: "flex", marginTop: `${headerHeight}px` , marginBottom: `${footerHeight}px` }}>
        <Sider drawerWidth={siderWidth} />
        <Box
          component="main"
          sx={{
            p: 2,
            width: `calc(100% - ${siderWidth}px)`,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Routes>
            <Route path="/" element={<><Login /></>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/discuss" element={<Discuss />} />
          </Routes>
        </Box>
      </Box>
      
      {/* Footer with dynamic height update */}
      <TonePlayer onHeightChange={setFooterHeight} />
    </>
  );
}

export default App;
