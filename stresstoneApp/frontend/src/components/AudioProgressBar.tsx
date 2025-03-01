import React, { useState, useEffect, useRef} from 'react';
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
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const blobUrl = URL.createObjectURL(blob);
      audioSourceRef.current = blobUrl;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = blobUrl;
        audioRef.current.load();
      } else {
        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
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

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioSourceRef.current) {
        URL.revokeObjectURL(audioSourceRef.current);
      }
    };
  }, [audioData]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.currentTime = currentTime; 
        audioRef.current.play();
        startUpdatingProgress();
      } else {
        audioRef.current.pause();
        cancelAnimationFrame(animationFrameRef.current as number);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && volume) {
      audioRef.current.volume = (volume / 100);
    }
  }, [volume]);

  const startUpdatingProgress = () => {
    const update = () => {
      if (audioRef.current && !isSeeking) {
        setCurrentTime(audioRef.current.currentTime);
        if (onProgressChange) {
          onProgressChange((audioRef.current.currentTime / duration) * 100);
        }
      }
      animationFrameRef.current = requestAnimationFrame(update);
    };
    cancelAnimationFrame(animationFrameRef.current as number); 
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