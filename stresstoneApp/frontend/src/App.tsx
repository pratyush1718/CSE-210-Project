import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import Discuss from './pages/DiscussPage';
import Header from './components/Header';
import Sider from './components/Sider';
import TonePlayer from './components/TonePlayer';
import Login from './components/Login';
import Register from './components/Register';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage.tsx';
import ToneCreationPage from './pages/TonecreationPage.tsx';
import { PlayerProvider } from './contexts/PlayerContext'; // Import PlayerProvider

const siderWidth = 240;
const headerHeight = 64;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [footerHeight, setFooterHeight] = useState(120);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      console.log('Auth state changed:', user);

      if (user) {
        console.log('User logged in:', user.email);
        setIsAuthenticated(true);
        setUserEmail(user.email || '');
      } else {
        console.log('User logged out or not authenticated');
        setIsAuthenticated(false);
        setUserEmail('');
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    setIsAuthenticated(false);
    setUserEmail('');
    console.log('User signed out');
  };

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PlayerProvider> 
      <CssBaseline />
      {isAuthenticated ? (
        <>
          <Header height={headerHeight} userEmail={userEmail} onSignOut={handleSignOut} />
          <Box sx={{ display: 'flex', marginTop: `${headerHeight}px`, marginBottom: `${footerHeight}px` }}>
            <Sider drawerWidth={siderWidth} />
            <Box component="main" sx={{ p: 2, width: `calc(100% - ${siderWidth}px)`, height: '100%', overflow: 'auto' }}>
              <Routes>
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
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </PlayerProvider>
  );
}

export default App;
