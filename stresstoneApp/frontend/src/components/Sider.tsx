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

import { useNavigate, useLocation } from 'react-router-dom';

interface MenuProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function Sider({ drawerWidth }: { drawerWidth: number }) {
  const navigate = useNavigate(); 

  const MenuMyStressTone: MenuProps[] = [
    {
      title: 'Home',
      icon: <HomeOutlined />,
      onClick: () => navigate('/'), 
    },
    {
      title: 'My Playlist',
      icon: <FavoriteBorderOutlined />,
      onClick: () => {},
    },
  ];

  const MenuCommunity: MenuProps[] = [
    {
      title: 'Explore',
      icon: <SearchOutlined />,
      onClick: () => navigate('/search'), 
    },
    {
      title: 'Discuss',
      icon: <FontAwesomeIcon icon={faComments} />,
      onClick: () => navigate('/discuss'),
    },
  ];

  const MenuCreator: MenuProps[] = [
    {
      title: 'Tone Creation',
      icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
      onClick: () => {},
    },
    {
      title: 'Upload',
      icon: <UploadFileOutlined />,
      onClick: () => {},
    },
  ];

  function renderListButton({ title, icon, onClick }: MenuProps) {
    return (
      <ListItemButton onClick={onClick}>
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
