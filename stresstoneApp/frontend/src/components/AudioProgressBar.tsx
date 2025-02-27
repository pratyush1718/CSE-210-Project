import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Slider,
  CircularProgress,
} from '@mui/material';

interface AudioProgressTrackerProps {
  audioData: ArrayBuffer | null; // WAV file data from backend
  isPlaying: boolean,
  isLooping: boolean;
  onProgressChange?: (progress: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const AudioProgressTracker: React.FC<AudioProgressTrackerProps> = ({
  audioData,
  isPlaying = false,
  isLooping = false,
  onProgressChange,
  onPlayStateChange,
}) => {
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<string | null>(null);

  // State
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up previous blob URL if it exists
    if (audioSourceRef.current) {
      URL.revokeObjectURL(audioSourceRef.current);
      audioSourceRef.current = null;
    }

    if (!audioData) {
      setIsLoaded(false);
      return;
    }

    try {
      setIsLoading(true);

      // Create blob from ArrayBuffer
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const blobUrl = URL.createObjectURL(blob);
      audioSourceRef.current = blobUrl;

      // Initialize or reset audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = blobUrl;
        audioRef.current.load();
      } else {
        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        // Set up event listeners
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
      }
      setError(null);
    } catch (err) {
      setError('Failed to process audio data');
      console.error('Error processing audio data:', err);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }

    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (audioSourceRef.current) {
        URL.revokeObjectURL(audioSourceRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioData]);

  // Update audio loop setting when isLooping changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoaded(true);
      setIsLoading(false);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);

      // Calculate progress percentage
      const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      if (onProgressChange) {
        onProgressChange(progressPercent);
      }
    }
  };

  // Handle end of audio
  const handleEnded = () => {
    if (!isLooping) {
      audioRef.current?.pause();
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
    }
  };

  // Handle audio loading error
  const handleError = (e: Event) => {
    console.error('Audio loading error:', e);
    setError('Failed to load audio');
    setIsLoading(false);
    setIsLoaded(false);
  };

  // Format time for display
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle seek
  const handleSeek = (_event: Event, newValue: number | number[]) => {
    const seekTo = ((newValue as number) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTo;
      setCurrentTime(seekTo);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Loading audio...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  // No audio data
  if (!audioData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No audio available
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: 'auto',
          justifyContent: 'center',
        }}
      >
        <IconButton onClick={togglePlay} color="inherit" disabled={!isLoaded}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        {showLoopControl && (
          <IconButton onClick={toggleLoop} color={isLooping ? 'primary' : 'default'} size="small">
            <Repeat />
          </IconButton>
        )}
      </Box> */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
        <Slider
          value={(currentTime / duration) * 100}
          onChange={handleSeek}
          aria-label="audio progress"
          disabled={!isLoaded}
          sx={(t) => ({
            color: 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&::before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                ...t.applyStyles('dark', {
                  boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                }),
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          })}
        />
        {/* <Typography variant="caption" color="text.secondary">
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography> */}
      </Box>
    </>
  );
};

export default AudioProgressTracker;
