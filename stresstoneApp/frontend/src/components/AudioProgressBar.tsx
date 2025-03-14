import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Slider, CircularProgress, LinearProgress } from '@mui/material';

interface AudioProgressTrackerProps {
  audioData: ArrayBuffer | null;
  isPlaying: boolean;
  isLooping?: boolean;
  volume?: number;
  isExpanded: boolean;
  onProgressChange?: (progress: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const AudioProgressTracker: React.FC<AudioProgressTrackerProps> = ({
  audioData,
  isPlaying = false,
  isLooping = false,
  volume,
  isExpanded = false,
  onProgressChange,
  onPlayStateChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false); // Track if user is seeking
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      const blob = new Blob([audioData], { type: 'audio/*' });
      const blobUrl = URL.createObjectURL(blob);
      audioSourceRef.current = blobUrl;

      if (audioRef.current) {
        // Clear previous event listeners to avoid duplicates
        const audio = audioRef.current;
        audio.pause();

        // Remove old listeners if they exist
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplay', handleCanPlay);

        // Set new source
        audio.src = blobUrl;
        audio.load();

        // Add all listeners again
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplay', handleCanPlay);
      } else {
        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplay', handleCanPlay);
      }
      setError(null);
    } catch (err) {
      setError('Failed to process audio data');
      console.error('Error processing audio data:', err);
    }

    return () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.pause();
        // Clean up event listeners
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplay', handleCanPlay);
      }
      if (audioSourceRef.current) {
        URL.revokeObjectURL(audioSourceRef.current);
      }
    };
  }, [audioData]); // Remove isPlaying from dependencies

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  useEffect(() => {
    if (audioRef.current && volume) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isLoaded) {
      handleCanPlay();
    }
  }, [isPlaying, isLoaded]);

  const startUpdatingProgress = () => {
    console.log('Starting progress updates');
    
    const update = () => {
      if (audioRef.current && !isSeeking) {
        const newTime = audioRef.current.currentTime;
        // Only update if time has changed to avoid unnecessary rerenders
        if (newTime !== currentTime) {
          setCurrentTime(newTime);
          if (onProgressChange) {
            onProgressChange((newTime / duration) * 100);
          }
        }
        // Schedule next update if still playing
        if (!audioRef.current.paused) {
          animationFrameRef.current = requestAnimationFrame(update);
        }
      } else {
        // Continue updates even if we had a temporary hiccup
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };
    
    // Cancel any existing animation frame before starting a new one
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(update);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setCurrentTime(0);
      setIsLoaded(true);
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    if (!isLooping) {
      audioRef.current?.pause();
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
    }
  };

  const handleError = (e: Event) => {
    console.error('Audio loading error:', e);
    setError('Failed to load audio');
    setIsLoading(false);
    setIsLoaded(false);
  };

  const handleCanPlay = () => {
    console.log('Audio can play now');
    setIsLoaded(true); // Make sure to mark as loaded
    setIsLoading(false);

    if (isPlaying && audioRef.current?.paused) {
      console.log('Auto-playing after load');
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Start updating progress AFTER play has succeeded
            startUpdatingProgress();
          })
          .catch((error) => {
            console.error('Auto-play failed:', error);
            if (onPlayStateChange) {
              onPlayStateChange(false);
            }
          });
      }
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeek = (_event: Event, newValue: number | number[]) => {
    const seekTime = ((newValue as number) / 100) * duration;
    setCurrentTime(seekTime);
  };

  const handleSeekEnd = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    setIsSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = ((newValue as number) / 100) * duration;
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (currentTime / duration) * 100;
  };

  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      console.log('Attempting to play audio');
      
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Play successful, starting progress updates');
              startUpdatingProgress();
            })
            .catch((error) => {
              console.error('Play failed:', error);
              if (onPlayStateChange) {
                onPlayStateChange(false);
              }
            });
        }
      } catch (error) {
        console.error('Play error:', error);
        if (onPlayStateChange) {
          onPlayStateChange(false);
        }
      }
    } else {
      audioRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isLoaded]);

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

  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  if (!audioData) {
    return; 
  }

  return (
    <>
      {isExpanded && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatTime(currentTime)}
          </Typography>
          <Slider
            value={duration > 0 && !isNaN(currentTime) ? getProgressPercentage() : 0}
            onChange={handleSeek}
            onChangeCommitted={handleSeekEnd}
            onMouseDown={handleSeekStart}
            aria-label="audio progress"
            disabled={!isLoaded}
            track={false}
            sx={{
              width: '100%',
              height: 4,
              color: 'rgba(0,0,0,0.87)',
              '& .MuiSlider-thumb': {
                width: 10,
                height: 10,
                transition: 'width 0.2s ease-in-out',
                '&::before': {
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                // '&:hover, &.Mui-focusVisible': {
                //   boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                //   ...t.applyStyles('dark', {
                //     boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                //   }),
                // },
                // '&.Mui-active': {
                //   height: 20,
                //   width: 20,
                // },
              },
              '& .MuiSlider-rail': {
                background: `linear-gradient(to right, rgba(0,0,0,0.87) ${getProgressPercentage()}%, #ddd ${getProgressPercentage()}%)`,
                opacity: 1,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {formatTime(duration)}
          </Typography>
        </Box>
      )}
      {!isLoaded && <LinearProgress sx={{ width: '100%', mt: 1 }} />}
    </>
  );
};

export default AudioProgressTracker;
