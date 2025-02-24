import Header from '../components/Header';
import Sider from '../components/Sider';
import { Box, CssBaseline } from '@mui/material';
import TonePlayer from '../components/TonePlayer';
import { Outlet } from 'react-router-dom';

const siderWidth = 240;
const headerHeight = 64;

const PageLayout: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Header height={headerHeight} />
      <Box sx={{ display: 'flex', marginTop: `${headerHeight}px` }}>
        <Sider drawerWidth={siderWidth} />
        <Box
          component="main"
          sx={{
            p: 2,
            width: `calc(100% - ${siderWidth}px)`,
            height: '100%',
            overflow: 'auto',
          }}
        >
          {/* All module implementation should go here */}
          <Outlet />
        </Box>
      </Box>
      <footer>
        <TonePlayer />
      </footer>
    </>
  );
};


export default PageLayout;