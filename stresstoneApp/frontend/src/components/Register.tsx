import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, CardHeader, Typography, Box, Link, Divider, Alert } from '@mui/material';
import RegisterComponentStyles from './RegisterStyles'; // Import styles
import MusicIcon from '../assets/MusicIcon.png'; // Import your PNG file
import { signUp } from '../auth';
import { useNavigate } from 'react-router-dom';
import { UserCredential } from 'firebase/auth';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isUserCredential = (result: unknown): result is UserCredential => {
    return typeof result === 'object' && result !== null && 'user' in result;
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    } else if (username === "" || email === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    } 
    
    const result = await signUp(email, username, password);
    
    if (isUserCredential(result)) { 
      setError(null); // Clear error on success
      console.log('Successfully registered:', result.user);
      navigate('/'); // Redirect to login page after successful registration
    } else {
      setError(result); // Display Firebase error message
    }
  };

  return (
    <Box sx={RegisterComponentStyles.container}>
      <Card sx={RegisterComponentStyles.card}>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <img src={MusicIcon} alt="Music Icon" style={{ width: 42, height: 42 }} />
        </Box>
        <CardHeader
          title={
            <Box>
              <Typography sx={{ fontWeight: 'bold', pb: 2 }} variant="h5" align="center">
                Register to listen and share on StressTone
              </Typography>
              <Divider sx={{ width: '100%', backgroundColor: '#F5F5F5', height: '1px' }} />
            </Box>
          }
        />
        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}

          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Email
          </Typography>
          <TextField
            sx={RegisterComponentStyles.textFieldContainer}
            fullWidth
            variant="outlined"
            margin="normal"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Username
          </Typography>
          <TextField
            sx={RegisterComponentStyles.textFieldContainer}
            fullWidth
            variant="outlined"
            margin="normal"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Password
          </Typography>
          <TextField
            sx={RegisterComponentStyles.textFieldContainer}
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Confirm Password
          </Typography>
          <TextField
            sx={RegisterComponentStyles.textFieldContainer}
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleRegister}>
            Register
          </Button>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold' }}>Already have an account?</Typography>
            <Link onClick={() => navigate('/')} sx={RegisterComponentStyles.registerButton}>
              LOGIN
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
