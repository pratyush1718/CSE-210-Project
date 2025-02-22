import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sider from './components/Sider';
import { Box, CssBaseline } from '@mui/material';
import TonePlayer from './components/TonePlayer';
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SearchPage from "./pages/SearchPage.tsx";

const siderWidth = 240;
const headerHeight = 64;

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/')
      .then((res) => setMessage(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <CssBaseline />
      <Header height={headerHeight} />
      <Box sx={{ display: "flex", marginTop: `${headerHeight}px` }}>
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
            <Route path="/" element={
              <>
                {/* Existing login and welcome message */}
                <Login />
                <p>Stresstone App</p>
                <p>{message}</p>
              </>
            } />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Box>
      </Box>
      <footer>
        <TonePlayer />
      </footer>
    </>
  );
}

export default App;