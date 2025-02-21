import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useLocation, useNavigate } from "react-router-dom";

import { 
  HomeOutlined, 
  FavoriteBorderOutlined,
  SearchOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faComments } from "@fortawesome/free-solid-svg-icons";

interface MenuProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const MenuMyStressTone: MenuProps[] = [
  {
    title: "Home",
    icon: <HomeOutlined />,
    onClick: () => {
      // return to the root page
      window.location.href = "/";
    },
  },
  {
    title: "My Playlist",
    icon: <FavoriteBorderOutlined />,
    onClick: () => {},
  },
];

function renderListButton(props: MenuProps & { active?: boolean }) {
  const { title, icon, onClick, active } = props;
  return (
    <ListItemButton 
      onClick={onClick}
      sx={{
        backgroundColor: active ? "#e0e0e0" : "inherit",
        "&:hover": { backgroundColor: active ? "#e0e0e0" : "lightgrey" },
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

export default function Sider({ drawerWidth }: SiderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const MenuCommunity: MenuProps[] = [
    {
      title: "Explore",
      icon: <SearchOutlined />,
      onClick: () => navigate("/search"),
    },
    {
      title: "Discuss",
      icon: <FontAwesomeIcon icon={faComments} />,
      onClick: () => {},
    },
  ];

  const MenuCreator: MenuProps[] = [
    {
      title: "Tone Creation",
      icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
      onClick: () => {},
    },
    {
      title: "Upload",
      icon: <UploadFileOutlined />,
      onClick: () => {},
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
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <ListItem>
          <Typography sx={MenuTitleStyle}>
            <b>My StressTone</b>
          </Typography>
        </ListItem>
        <Divider />
        <List>
          {MenuMyStressTone.map((content: MenuProps) =>
            renderListButton(content)
          )}
        </List>
        <ListItem>
          <Typography sx={MenuTitleStyle}>
            <b>Community</b>
          </Typography>
        </ListItem>
        <Divider />
        <List>
          {MenuCommunity.map((item: MenuProps) =>
            renderListButton({
              ...item,
              active: item.title === "Explore" && location.pathname === "/search",
            })
          )}
        </List>
        <ListItem>
          <Typography sx={MenuTitleStyle}>
            <b>Creator</b>
          </Typography>
        </ListItem>
        <Divider />
        <List>
          {MenuCreator.map((content: MenuProps) => renderListButton(content))}
        </List>
      </Box>
    </Drawer>
  );
}

const MenuTitleStyle = {
  padding: "6px 0px 6px 0px",
};
