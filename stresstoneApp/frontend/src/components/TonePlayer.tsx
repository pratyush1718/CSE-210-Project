import { Input, Avatar, Typography, Toolbar, AppBar, Button } from "@mui/material";

export default function TonePlayer() {
  return (
    <AppBar
      position="fixed"
      sx={{
        // Appera above sider
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#fff",
        top: "auto",
        bottom: 0,
        minHeight: "120px",
      }}
    >
      <Toolbar>
        <div style={{
          color: "black"
        }}>Music player components</div>
        <Button>Play</Button>
      </Toolbar>
    </AppBar>
  );
}
