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

function renderListButton(props: MenuProps & { active?: boolean }) {
  const { title, icon, onClick, active } = props;
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        backgroundColor: active ? '#e0e0e0' : 'inherit',
        '&:hover': { backgroundColor: active ? '#e0e0e0' : 'lightgrey' },
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  );
}

interface SiderProps {
  drawerWidth: number;
}

export default function Sider(props: SiderProps) {
  const { drawerWidth } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const MenuMyStressTone: MenuProps[] = [
    {
      title: 'Home',
      icon: <HomeOutlined />,
      onClick: () => {
        window.location.href = '/';
      },
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
      onClick: () => {},
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
      onClick: () => navigate('/upload'),
    },
  ];

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
        <List>
          {MenuCommunity.map((item) =>
            renderListButton({
              ...item,
              active: item.title === 'Explore' && location.pathname === '/search',
            }),
          )}
        </List>
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