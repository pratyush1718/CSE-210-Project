import { useState, useEffect } from 'react';
import { Toolbar, AppBar, IconButton, Typography, Slider, Box, Avatar, Tooltip } from '@mui/material';
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
import { usePlayer } from '../stateManagement/PlayerContext';
import { fetchTrackAudio } from '../constants';

interface TonePlayerProps {
  onHeightChange: (height: number) => void; // Callback function to send height updates
}

export default function TonePlayer({ onHeightChange }: TonePlayerProps) {
  const PORT = import.meta.env.VITE_BACKEND_PORT || 3000;
  const API_URL = `http://localhost:${PORT}/api`;

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isExpanded, setIsExpanded] = useState(true);
  const { currentTrack, isPlaying, setIsPlaying, togglePlay } = usePlayer();

  const handleShuffle = () => setIsShuffle((prev) => !prev);
  const handleRepeat = () => setIsRepeat((prev) => !prev);
  const handlePlayPause = () => togglePlay();
  // const handlePlayEnd = (playstate: boolean) => setIsPlaying(playstate);
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    onHeightChange(isExpanded ? 120 : 64); // Update parent with the new height
  }, [isExpanded, onHeightChange]);

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  /* Code below subject to change after connection to backend */
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    if (currentTrack?.audioUrl) {
      setAudioData(null); // Clear previous audio data
      const audio = fetchTrackAudio(currentTrack.audioUrl);
      audio.then((data) => {
        setAudioData(data);
      })
    }
  }, [currentTrack]);

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
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
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
            overflow: 'hidden',
            maxWidth: '100%',
            justifySelf: 'start',
          }}
        >
          <Avatar
            alt={currentTrack?.title || 'Album Cover'}
            src={currentTrack?.imageFileId ? `${API_URL}/audio/image/${currentTrack.imageFileId}` : ''}
            sx={{
              width: isExpanded ? 60 : 40,
              height: isExpanded ? 60 : 40,
              marginRight: 2,
              flexShrink: 0,
              transition: 'all 0.3s ease-in-out',
            }}
          />
          <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <Typography 
              variant={isExpanded ? 'h6' : 'body1'} 
              sx={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                maxWidth: isExpanded ? '240px' : '180px',
              }}
            >
              {currentTrack?.title || 'No track selected'}
            </Typography>
            {isExpanded && (
              <Typography 
                variant="body2" 
                sx={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}
              >
                {currentTrack?.creator?.name || 'Unknown artist'}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Center: Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            justifyContent: 'center',
            justifySelf: 'center',
          }}
        >
          {isExpanded && (
            <>
              <Tooltip title="Shuffle" placement="top">
                <IconButton color={isShuffle ? 'primary' : 'inherit'} onClick={handleShuffle}>
                  <Shuffle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Previous" placement="top">
                <IconButton color="inherit">
                  <SkipPrevious />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title={isPlaying ? 'Pause' : 'Play'} placement="top">
            <IconButton color="inherit" onClick={handlePlayPause}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
          {isExpanded && (
            <>
              <Tooltip title="Next" placement="top">
                <IconButton color="inherit">
                  <SkipNext />
                </IconButton>
              </Tooltip>
              <Tooltip title="Repeat" placement="top">
                <IconButton color={isRepeat ? 'primary' : 'inherit'} onClick={handleRepeat}>
                  <Repeat />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        {/* Right side: Volume Slider & Expand Button */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            justifySelf: 'end'
          }}
        >
          {isExpanded && (
            <>
              <VolumeUp />
              <Slider
                value={volume}
                track={false}
                onChange={handleVolumeChange}
                aria-labelledby="volume-slider"
                min={0}
                max={100}
                sx={{
                  width: 100,
                  color: 'rgba(0,0,0,0.87)',
                  '& .MuiSlider-thumb': {
                    width: 10,
                    height: 10,
                  },
                  '& .MuiSlider-rail': {
                    background: `linear-gradient(to right, rgba(0,0,0,0.87) ${volume}%, #ddd ${volume}%)`,
                    opacity: 1,
                  },
                }}
              />
            </>
          )}
        </Box>
      </Toolbar>

      {/* Progress Bar */}
      <Box sx={{ width: '50%', padding: '0 16px' }}>
        <AudioProgressTracker
          audioData={audioData}
          isPlaying={isPlaying}
          isLooping={isRepeat}
          volume={volume}
          isExpanded={isExpanded}
          onPlayStateChange={setIsPlaying}
        />
      </Box>
    </AppBar>
  );
}