import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, CardHeader, Typography, Box, Link, Divider, Alert } from '@mui/material';
import LoginComponentStyles from './LoginStyles';
import MusicIcon from '../assets/MusicIcon.png';
import { signIn } from '../auth';
import { useNavigate } from 'react-router-dom';
import { UserCredential } from 'firebase/auth';

interface LoginProps {
  onLogin: (email: string) => void; // Callback passed from App.tsx
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isUserCredential = (result: unknown): result is UserCredential => {
    return typeof result === 'object' && result !== null && 'user' in result;
  };

  const handleLogin = async () => {
    try {
      const result = await signIn(email, password);
      if (isUserCredential(result)) {
        setError(null);
        console.log('Successfully logged in:', result.user);
        onLogin(email);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
      console.error(error); // Log the actual error for debugging
    }
  };

  return (
    <Box sx={LoginComponentStyles.container}>
      <Card sx={LoginComponentStyles.card}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src={MusicIcon} alt="Music Icon" style={{ width: 42, height: 42 }} />
        </Box>
        <CardHeader
          title={
            <Box>
              <Typography sx={{ fontWeight: 'bold', pb: 4.25 }} variant="h5" align="center">
                Login to StressTone
              </Typography>
              <Divider sx={{ width: '100%', backgroundColor: '#F5F5F5', height: '1px' }} />
            </Box>
          }
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Email
          </Typography>
          <TextField
            sx={LoginComponentStyles.textFieldContainer}
            fullWidth
            variant="outlined"
            margin="normal"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Password
          </Typography>
          <Box sx={LoginComponentStyles.textFieldContainer}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              type={'password'}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
            Login
          </Button>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold' }}>Don't have an account?</Typography>
            <Link onClick={() => navigate('/register')} sx={LoginComponentStyles.registerButton}>
              REGISTER
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
