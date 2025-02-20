import { Input, Avatar, Typography, Toolbar, AppBar } from '@mui/material';

interface HeaderProps {
  height: number;
}

export default function Header(props: HeaderProps) {
  const { height } = props;
  return (
    <AppBar
      position="fixed"
      sx={{
        // Appera above sider
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#fff',
        minHeight: height,
      }}
    >
      <Toolbar>
        <Typography variant="h5" component="div" color="black">
          StressTone
        </Typography>
        <Input
          placeholder="Search"
          sx={{
            marginLeft: 'auto',
            marginRight: '1rem',
            width: '20rem',
          }}
        />
        <Avatar>H</Avatar>
      </Toolbar>
    </AppBar>
  );
}
