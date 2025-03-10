import { Box, Chip, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useState } from 'react';
import { TonePreviewProps } from '../types';
import AudioProgressTracker from './AudioProgressBar';

const AudioPreviewCard: React.FC<TonePreviewProps> = (props: TonePreviewProps) => {
  const { tags, audioData } = props
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlayEnd = (playstate: boolean) => setIsPlaying(playstate);

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, padding: '0 0 5px 0' }}>
        {tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <IconButton onClick={togglePlay}>{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}</IconButton>
        <AudioProgressTracker
          audioData={audioData}
          isPlaying={isPlaying}
          isExpanded
          onPlayStateChange={handlePlayEnd}
        />
      </Box>
    </>
  );
};

export default AudioPreviewCard;
