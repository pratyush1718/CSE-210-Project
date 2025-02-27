import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Divider,
  Chip,
  Card,
  CardContent,
  Slider,
  Grid,
  Paper,
  Stack,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';

const ToneCreationPage: React.FC = () => {
  // State for multiple choice selections
  const [imageryTags, setImageryTags] = useState<string[]>([]);
  const [artisticTags, setArtisticTags] = useState<string[]>([]);
  const [environmentTags, setEnvironmentTags] = useState<string[]>([]);
  const [playbackPosition, setPlaybackPosition] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Sample tags for each category - updated for stress relief focus
  const imageryOptions = ['Nature', 'Beach', 'Forest', 'Mountains', 'Garden', 'Rain'];
  const artisticOptions = ['Calm', 'Soothing', 'Relaxing', 'Peaceful', 'Gentle', 'Ambient'];
  const environmentOptions = ['Meditation', 'Spa', 'Night', 'Morning', 'Ocean', 'Wilderness'];

  // Sample bookmarked tones
  const savedTones = [
    {
      id: 1,
      prompt: 'Gentle rainfall on a forest canopy',
      imagery: ['Nature', 'Forest', 'Rain'],
      artistic: ['Peaceful', 'Ambient'],
      environment: ['Wilderness'],
      progress: 65,
    },
    {
      id: 2,
      prompt: 'Ocean waves at sunset with distant birds',
      imagery: ['Beach', 'Nature'],
      artistic: ['Calm', 'Relaxing'],
      environment: ['Ocean'],
      progress: 42,
    },
    {
      id: 3,
      prompt: 'Soft wind through morning meadow',
      imagery: ['Nature', 'Garden'],
      artistic: ['Gentle', 'Soothing'],
      environment: ['Morning'],
      progress: 27,
    },
  ];

  // Handle tag selection
  const handleTagToggle = (tag: string, category: string) => {
    if (category === 'imagery') {
      setImageryTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    } else if (category === 'artistic') {
      setArtisticTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    } else if (category === 'environment') {
      setEnvironmentTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    }
  };

  // Handle playback position change
  const handlePlaybackChange = (event: Event, newValue: number | number[]) => {
    setPlaybackPosition(newValue as number);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Input Box */}
            <TextField
              label="StressTone Prompt"
              variant="outlined"
              fullWidth
              placeholder="Describe the relaxing sound you want to generate"
              multiline
              rows={2}
            />

            {/* Imagery Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Imagery
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {imageryOptions.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagToggle(tag, 'imagery')}
                    color={imageryTags.includes(tag) ? 'primary' : 'default'}
                    variant={imageryTags.includes(tag) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* Artistic Feature Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Artistic Feature
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {artisticOptions.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagToggle(tag, 'artistic')}
                    color={artisticTags.includes(tag) ? 'primary' : 'default'}
                    variant={artisticTags.includes(tag) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* Environment Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Environment
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {environmentOptions.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagToggle(tag, 'environment')}
                    color={environmentTags.includes(tag) ? 'primary' : 'default'}
                    variant={environmentTags.includes(tag) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* Music Player Card */}
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preview
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton onClick={togglePlay} color="primary">
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {isPlaying ? 'Now Playing' : 'Click to Play'}
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <Slider value={playbackPosition} onChange={handlePlaybackChange} aria-labelledby="playback-slider" />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      0:00
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.floor(playbackPosition / 60)}:{String(playbackPosition % 60).padStart(2, '0')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2:00
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Scrollable Card List */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              height: '85vh',
              overflowY: 'auto',
              p: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Bookmarked Tones
            </Typography>
            <Stack spacing={2}>
              {savedTones.map((tone) => (
                <Card key={tone.id} elevation={2} sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Grid container>
                      {/* Left side with tone details */}
                      <Grid item xs={9} sx={{ pr: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {tone.prompt}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {tone.imagery.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" color="primary" variant="outlined" />
                          ))}
                          {tone.artistic.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" color="secondary" variant="outlined" />
                          ))}
                          {tone.environment.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" color="info" variant="outlined" />
                          ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <IconButton size="small" color="primary">
                            <PlayArrowIcon />
                          </IconButton>
                          <Box sx={{ width: '100%', ml: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={tone.progress}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            0:00
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            2:00
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Vertical divider */}
                      <Divider orientation="vertical" flexItem />

                      {/* Right side with action buttons */}
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          pl: 2,
                        }}
                      >
                        <ButtonGroup orientation="horizontal" variant="outlined" sx={{ width: '100%' }}>
                          <IconButton>
                            <UploadIcon />
                          </IconButton>
                          <IconButton>
                            <DownloadIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ToneCreationPage;
