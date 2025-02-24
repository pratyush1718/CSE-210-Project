import { useState, useEffect } from 'react';
import { Toolbar, AppBar, IconButton, Typography, Slider, Box, LinearProgress, Avatar } from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipNext, 
  SkipPrevious, 
  VolumeUp, 
  Shuffle, 
  Repeat,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

export default function TonePlayer() {
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleShuffle = () => setIsShuffle((prev) => !prev);
  const handleRepeat = () => setIsRepeat((prev) => !prev);
  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const updateProgress = () => {
    setProgress((prev) => {
      const newProgress = prev + 1;
      return newProgress <= 100 ? newProgress : 0;
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(updateProgress, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#fff',
        top: 'auto',
        bottom: 0,
        minHeight: isExpanded ? '120px' : '64px',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 16px',
        transition: 'min-height 0.3s ease-in-out',
      }}
    >
      {/* Collapse/Expand Button */}
      <IconButton
        onClick={handleToggleExpand}
        sx={{
          position: 'absolute',
          top: -28,
          right: 16,
          bgcolor: 'white',
          boxShadow: '0 0 8px rgba(0,0,0,0.2)',
          '&:hover': {
            bgcolor: 'white',
          }
        }}
      >
        {isExpanded ? <ExpandMore /> : <ExpandLess />}
      </IconButton>

      <Toolbar 
        sx={{ 
          width: '100%', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: isExpanded ? 'auto' : '64px',
          overflow: 'hidden'
        }}
      >
        {/* Left side: Album Cover and Song Title */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: isExpanded ? 'auto' : '33%'
        }}>
          <Avatar
            alt="Album Cover"
            src="https://via.placeholder.com/60"
            sx={{ 
              width: isExpanded ? 60 : 40, 
              height: isExpanded ? 60 : 40, 
              marginRight: 2,
              transition: 'all 0.3s ease-in-out'
            }}
          />
          <Box>
            <Typography variant={isExpanded ? "h6" : "body1"}>Song Title</Typography>
            {isExpanded && <Typography variant="body2">Artist</Typography>}
          </Box>
        </Box>

        {/* Center: Controls */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          width: isExpanded ? 'auto' : '33%',
          justifyContent: 'center'
        }}>
          {isExpanded && (
            <>
              <IconButton color={isShuffle ? 'primary' : 'inherit'} onClick={handleShuffle}>
                <Shuffle />
              </IconButton>
              <IconButton color="inherit">
                <SkipPrevious />
              </IconButton>
            </>
          )}
          <IconButton color="inherit" onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          {isExpanded && (
            <>
              <IconButton color="inherit">
                <SkipNext />
              </IconButton>
              <IconButton color={isRepeat ? 'primary' : 'inherit'} onClick={handleRepeat}>
                <Repeat />
              </IconButton>
            </>
          )}
        </Box>

        {/* Right side: Volume Slider */}
        {isExpanded && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VolumeUp />
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              aria-labelledby="volume-slider"
              min={0}
              max={100}
              sx={{ width: 100 }}
            />
          </Box>
        )}
      </Toolbar>

      {/* Progress Bar */}
      <Box sx={{ 
        width: '50%', 
        padding: '0 16px',
        opacity: isExpanded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        height: isExpanded ? 'auto' : 0
      }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 5, bgcolor: '#ddd', borderRadius: 2 }}
        />
      </Box>
    </AppBar>
  );
}
