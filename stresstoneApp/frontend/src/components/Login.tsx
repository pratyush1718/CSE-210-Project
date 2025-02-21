import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, CardHeader, Typography, Box, Link, Divider } from '@mui/material';
import LoginComponentStyles from './LoginStyles'; // Import styles
import MusicIcon from '../assets/MusicIcon.png'; // Import your PNG file

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
              <Divider sx={{ width: '359px', backgroundColor: '#F5F5F5', fill: '100%', height: '1px' }} />
            </Box>
          }
        />
        <CardContent>
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
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Login
          </Button>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold' }}>Don't have an account?</Typography>
            <Link href="/register" sx={LoginComponentStyles.registerButton}>
              REGISTER
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
