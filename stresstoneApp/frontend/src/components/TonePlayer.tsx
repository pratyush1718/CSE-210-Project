import { useState, useEffect } from 'react';
import { Toolbar, AppBar, IconButton, Typography, Slider, Box, LinearProgress, Avatar } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious, VolumeUp, Shuffle, Repeat } from '@mui/icons-material';

export default function TonePlayer() {
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(30); // Progress percentage (0-100)
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30); // Volume state (0-100)

  const handleShuffle = () => setIsShuffle((prev) => !prev);
  const handleRepeat = () => setIsRepeat((prev) => !prev);
  const handlePlayPause = () => setIsPlaying((prev) => !prev);

  // Simulating progress update
  const updateProgress = () => {
    setProgress((prev) => {
      const newProgress = prev + 1;
      return newProgress <= 100 ? newProgress : 0; // Loop progress
    });
  };

  // Use an interval to update the progress (simulating song progress)
  useEffect(() => {
    const interval = setInterval(updateProgress, 100); // Update every 100ms
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  // Handle volume change from slider
  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    setVolume(newValue as number); // Update the volume state when slider changes
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#fff',
        top: 'auto',
        bottom: 0,
        minHeight: '120px',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <Toolbar sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left side: Album Cover and Song Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Album Cover */}
          <Avatar
            alt="Album Cover"
            src="https://via.placeholder.com/60" // Replace with the actual album cover URL
            sx={{ width: 60, height: 60, marginRight: 2 }}
          />
          {/* Song Title and Artist */}
          <Box>
            <Typography variant="h6">Song Title</Typography>
            <Typography variant="body2">Artist</Typography>
          </Box>
        </Box>

        {/* Center: Controls (Play, Pause, Skip, Shuffle, Repeat) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color={isShuffle ? 'primary' : 'inherit'}
            onClick={handleShuffle}
          >
            <Shuffle />
          </IconButton>
          <IconButton color="inherit">
            <SkipPrevious />
          </IconButton>
          <IconButton color="inherit" onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton color="inherit">
            <SkipNext />
          </IconButton>
          <IconButton
            color={isRepeat ? 'primary' : 'inherit'}
            onClick={handleRepeat}
          >
            <Repeat />
          </IconButton>
        </Box>

        {/* Right side: Volume Slider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VolumeUp />
          <Slider
            value={volume}
            onChange={handleVolumeChange} // Update volume on change
            aria-labelledby="volume-slider"
            min={0}
            max={100}
            sx={{ width: 100 }}
          />
        </Box>
      </Toolbar>

      {/* Progress Bar */}
      <Box sx={{ width: '50%', padding: '0 16px' }}>
        <LinearProgress
          variant="determinate"
          // value={progress}
          sx={{ height: 5, bgcolor: '#ddd', borderRadius: 2 }}
        />
      </Box>
    </AppBar>
  );
}
