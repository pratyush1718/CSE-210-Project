import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  IconButton,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';

import AudioPreviewCard from '../components/AudioPreviewCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { Bookmark, Delete, Upload } from '@mui/icons-material';
import { musicgenDispatcher } from '../controller/musicgenDispatcher';
import { ToneLengthOptions, ToneLengthTypes, TonePreviewProps } from '../types';

const ToneCreationPage: React.FC = () => {
  // State for multiple choice selections
  const [imageryTags, setImageryTags] = useState<string[]>([]);
  const [artisticTags, setArtisticTags] = useState<string[]>([]);
  const [environmentTags, setEnvironmentTags] = useState<string[]>([]);

  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [fullPrompt, setFullPrompt] = useState<string>('');
  const [toneLength, setToneLength] = useState<ToneLengthTypes>('short');

  const [musicId, setMusicId] = useState<number>(0);
  const [viewTags, setViewTags] = useState<string[]>([]);

  const [bookmarkedTones, setBookmarkedTones] = useState<TonePreviewProps[]>([]);

  // Sample tags for each category - updated for stress relief focus
  const imageryOptions = ['Nature', 'Beach', 'Forest', 'Mountains', 'Garden', 'Rain'];
  const artisticOptions = ['Calm', 'Soothing', 'Relaxing', 'Peaceful', 'Gentle', 'Ambient'];
  const environmentOptions = ['Meditation', 'Spa', 'Night', 'Morning', 'Ocean', 'Wilderness'];

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

  const generatePrompt = () => {
    if (textPrompt === '' && imageryTags.length === 0 && artisticTags.length === 0 && environmentTags.length === 0) {
      alert('Please enter a prompt');
      return null;
    }
    const promptElems = [textPrompt, ...imageryTags, ...artisticTags, ...environmentTags].filter((tag) => tag !== '');

    const fullPrompt = promptElems.join(', ');
    setFullPrompt(fullPrompt);
    return fullPrompt;
  };

  // should be async
  const handleGenerate = async () => {
    const fullPrompt = generatePrompt();
    if (fullPrompt) {
      setViewTags([...imageryTags, ...artisticTags, ...environmentTags]);
      setMusicId((prev) => prev + 1);
      setIsLoading(true);
      setIsGenerated(false);
      // use controller logic
      let audio = await musicgenDispatcher({ text: fullPrompt, length: 'test'});
      setAudioData(audio);
      setIsLoading(false);
      setIsGenerated(true);
    }
  };

  const handleBookmark = () => {
    setBookmarkedTones((prev) => {
      const newTone = {
        id: musicId,
        title: fullPrompt,
        tags: viewTags,
        audioData: audioData,
      } as TonePreviewProps;

      // Check if the newTone already exists in the prev array
      const exists = prev.some((tone) => tone.id === newTone.id);

      // If it doesn't exist, add it to the array
      if (!exists) {
        return [...prev, newTone];
      }

      // If it exists, return the previous array unchanged
      return prev;
    });
  };

  const handleDeleteBookmark = (id: number) => {
    setBookmarkedTones((prev) => prev.filter((tone) => tone.id !== id));
  };

  const handleUpdateToneLength = (currentOption: ToneLengthTypes) => {
    setToneLength(currentOption);
  }

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
              onChange={(e) => setTextPrompt(e.target.value)}
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

            <Box>
              <Typography variant="h6" gutterBottom>
                Tone Length
              </Typography>
              <Divider />
              <RadioGroup row value={toneLength} onChange={(e) => handleUpdateToneLength(e.target.value)}>
                {ToneLengthOptions.map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </Box>

            <Button
              loading={isLoading}
              variant="contained"
              onClick={handleGenerate}
              startIcon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
            >
              Generate
            </Button>

            {/* Music Player Card */}
            {isGenerated && audioData ? (
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between' }}>
                    <Typography>{fullPrompt}</Typography>
                    <IconButton size="small" onClick={handleBookmark}>
                      <Bookmark />
                    </IconButton>
                  </Box>
                  <AudioPreviewCard audioData={audioData} id={musicId} title={fullPrompt} tags={viewTags} />
                </CardContent>
              </Card>
            ) : (
              <></>
            )}
          </Stack>
        </Grid>

        {/* Right Column - Scrollable Card List */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ overflow: 'scroll', maxHeight: '80%' }}>
            {bookmarkedTones.map((tone) => {
              return (
                <CardContent>
                  <Box sx={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between' }}>
                    <Typography>{tone.title}</Typography>
                    <div style={{ display: 'flex' }}>
                      <IconButton size="small" onClick={() => alert('TBD')}>
                        <Upload />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteBookmark(tone.id)}>
                        <Delete />
                      </IconButton>
                    </div>
                  </Box>
                  <AudioPreviewCard audioData={tone.audioData} id={tone.id} title={tone.title} tags={tone.tags} />
                </CardContent>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ToneCreationPage;
