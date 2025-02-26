import { useState, useEffect } from 'react';
import { Toolbar, AppBar, IconButton, Typography, Slider, Box, Avatar } from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipNext, 
  SkipPrevious, 
  VolumeUp, 
  Shuffle, 
  Repeat,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import AudioProgressTracker from './AudioProgressBar';

interface TonePlayerProps {
  onHeightChange: (height: number) => void; // Callback function to send height updates
}

export default function TonePlayer({ onHeightChange }: TonePlayerProps) {
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleShuffle = () => setIsShuffle((prev) => !prev);
  const handleRepeat = () => setIsRepeat((prev) => !prev);
  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handlePlayEnd = (playstate: boolean) => setIsPlaying(playstate);
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    onHeightChange(isExpanded ? 120 : 64); // Update parent with the new height
  }, [isExpanded, onHeightChange]);

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  /* Code below subject to change after connection to backend */
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    fetchAudio();
  }, []);

  const fetchAudio = async () => {
    try {
      const response = await fetch('IDM_Smooth.wav');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength === 0) {
        throw new Error('The fetched audio data is empty.');
      }
      setAudioData(buffer);
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };
  /* End code change region */

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
      <Toolbar
        sx={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: isExpanded ? 'auto' : '64px',
          overflow: 'hidden',
        }}
      >
        {/* Left side: Album Cover and Song Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: isExpanded ? 'auto' : '33%',
          }}
        >
          <Avatar
            alt="Album Cover"
            src="" // album cover source.
            sx={{
              width: isExpanded ? 60 : 40,
              height: isExpanded ? 60 : 40,
              marginRight: 2,
              transition: 'all 0.3s ease-in-out',
            }}
          />
          <Box>
            <Typography variant={isExpanded ? 'h6' : 'body1'}>Song Title</Typography>
            {isExpanded && <Typography variant="body2">Artist</Typography>}
          </Box>
        </Box>

        {/* Center: Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: isExpanded ? 'auto' : '33%',
            justifyContent: 'center',
          }}
        >
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

        {/* Right side: Volume Slider & Expand Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isExpanded && (
            <>
              <VolumeUp />
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                aria-labelledby="volume-slider"
                min={0}
                max={100}
                sx={{
                  width: 100,
                  color: 'rgba(0,0,0,0.87)',
                }}
              />
            </>
          )}
          {/* Collapse/Expand Button */}
          <IconButton onClick={handleToggleExpand} sx={{ ml: 1 }}>
            {isExpanded ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Progress Bar */}
      <Box sx={{ width: '50%', padding: '0 16px' }}>
        <AudioProgressTracker
          audioData={audioData}
          isPlaying={isPlaying}
          isLooping={isRepeat}
          isExpanded={isExpanded}
          onPlayStateChange={handlePlayEnd}
        />
      </Box>  
    </AppBar>
  );
}
