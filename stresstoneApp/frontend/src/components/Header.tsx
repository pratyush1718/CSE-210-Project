import { Avatar, Typography, Toolbar, AppBar, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import MusicIcon from '../assets/MusicIcon.png';

interface HeaderProps {
  height: number;
  onSignOut: () => void;
  userEmail: string; // Pass the email to the Header component
}

export default function Header(props: HeaderProps) {
  const { height, onSignOut, userEmail } = props;

  // State for managing the dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Open the menu when avatar is clicked
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Get the first letter of the user's email for the avatar
  const avatarLetter = userEmail.charAt(0).toUpperCase();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#fff',
        minHeight: height,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none' }}>
          <img src={MusicIcon} alt="Music Icon" style={{ width: 42, height: 42 }} />
          <Typography variant="h5" component="div" color="black">
            StressTone
          </Typography>
        </a>
        {/* <Input
          placeholder="Search"
          sx={{
            marginLeft: "auto",
            marginRight: "1rem",
            width: "20rem",
          }}
        />*/}

        {/* Profile Avatar with first letter of the email */}
        <Avatar sx={{ cursor: 'pointer' }} onClick={handleClick}>
          {avatarLetter}
        </Avatar>

        {/* Menu for Sign Out */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'profile-avatar',
          }}
        >
          <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
