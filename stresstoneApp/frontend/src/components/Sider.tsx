import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { HomeOutlined, FavoriteBorderOutlined, SearchOutlined, UploadFileOutlined } from '@mui/icons-material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faComments } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface MenuProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function Sider({ drawerWidth }: { drawerWidth: number }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<string>('Home');

  const MenuMyStressTone: MenuProps[] = [
    {
      title: 'Home',
      icon: <HomeOutlined />,
      onClick: () => {
        navigate('/');
        setCurrentPage('Home');
      },
    },
    {
      title: 'My Favorites',
      icon: <FavoriteBorderOutlined />,
      onClick: () => {
        navigate('/liked');
        setCurrentPage('My Favorites');
      },
    },
  ];

  const MenuCommunity: MenuProps[] = [
    {
      title: 'Explore',
      icon: <SearchOutlined />,
      onClick: () => {
        navigate('/search');
        setCurrentPage('Explore');
      },
    },
    {
      title: 'Discuss',
      icon: <FontAwesomeIcon icon={faComments} />,
      onClick: () => {
        navigate('/discuss');
        setCurrentPage('Discuss');
      },
    },
  ];

  const MenuCreator: MenuProps[] = [
    {
      title: 'Tone Creation',
      icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
      onClick: () => {
        navigate('/toneCreation');
        setCurrentPage('Tone Creation');
      },
    },
    {
      title: 'Upload',
      icon: <UploadFileOutlined />,
      onClick: () => {
        navigate('/upload');
        setCurrentPage('Upload');
      },
    },
  ];

  function renderListButton({ title, icon, onClick }: MenuProps) {
    const backgroundColor = currentPage === title ? '#f5f5f5' : 'white';
    return (
      <ListItemButton onClick={onClick} sx={{ backgroundColor: backgroundColor }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <ListItem>
          <Typography sx={MenuTitleStyle}>
            <b>My StressTone</b>
          </Typography>
        </ListItem>
        <Divider />
        <List>{MenuMyStressTone.map((item) => renderListButton(item))}</List>
        <ListItem>
          <Typography sx={MenuTitleStyle}>
            <b>Community</b>
          </Typography>
        </ListItem>
        <Divider />
        <List>{MenuCommunity.map((item) => renderListButton(item))}</List>
        <ListItem>
          <Typography sx={MenuTitleStyle}>
            <b>Creator</b>
          </Typography>
        </ListItem>
        <Divider />
        <List>{MenuCreator.map((item) => renderListButton(item))}</List>
      </Box>
    </Drawer>
  );
}

const MenuTitleStyle = {
  padding: '6px 0px 6px 0px',
};
