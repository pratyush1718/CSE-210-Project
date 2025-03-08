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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AudioPreviewCard from '../components/AudioPreviewCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { Bookmark, Delete, Download, Upload } from '@mui/icons-material';
import { musicgenDispatcher } from '../controller/musicgenDispatcher';
import { ToneLengthOptions, ToneLengthTypes, TonePreviewProps } from '../types';
import useUploadStore from '../stores/useUploadState';

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
      const audio = await musicgenDispatcher({ text: fullPrompt, length: toneLength });
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
  };

  const [uploadModalStatus, setUploadModalStatus] = useState(false);

  const [uploadMusicId, setUploadMusicId] = useState(0);
  const handleUploadTone = (id: number) => {
    setUploadModalStatus(true);
    setUploadMusicId(id);
  };

  const handleCloseUploadModal = () => {
    setUploadModalStatus(false);
  };

  const { setTitle, setAudioFile, setTags } = useUploadStore();
  const navigation = useNavigate();

  const createWavFile = (audioData: ArrayBuffer) => {
    const blob = new Blob([audioData], { type: 'audio/wav' });
    return new File([blob], 'generated_audio.wav', { type: 'audio/wav' });
  };

  const handleConfirmUpload = () => {
    // goto the upload page under the route /upload
    // Turn the audioData into a File data
    const uploadAudio = bookmarkedTones.find((tone) => tone.id === uploadMusicId);
    if (uploadAudio) {
      const file = createWavFile(uploadAudio.audioData);
      // set global state     // Note: I will need a global state controller to finish this
      setTitle(uploadAudio.title);
      setAudioFile(file);
      setTags(uploadAudio.tags);
      // goto upload page
      navigation('/upload');
    }
  };

  const handleDownload = (id: number) => {
    const downloadAudio = bookmarkedTones.find((tone) => tone.id === id);
    if (downloadAudio) {
      const file = createWavFile(downloadAudio.audioData);
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated_audio.wav';
      link.click();
      URL.revokeObjectURL(url);
    }
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
    <>
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
                      <Tooltip title="Bookmark this tone">
                        <IconButton size="small" onClick={handleBookmark}>
                          <Bookmark />
                        </IconButton>
                      </Tooltip>
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
              {bookmarkedTones.length === 0 ? (
                <CardContent>
                  <Typography
                    color="textSecondary"
                    sx={{ alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}
                  >
                    View your bookmarked sound here and explore for more!
                  </Typography>
                </CardContent>
              ) : (
                bookmarkedTones.map((tone) => {
                  return (
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between' }}>
                        <Typography>{tone.title}</Typography>
                        <div style={{ display: 'flex' }}>
                          <Tooltip title="Upload this sound to StressTone">
                            <IconButton size="small" onClick={() => handleUploadTone(tone.id)}>
                              <Upload />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download this sound to machine">
                            <IconButton size="small" onClick={() => handleDownload(tone.id)}>
                              <Download />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete this sound">
                            <IconButton size="small" onClick={() => handleDeleteBookmark(tone.id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </Box>
                      <AudioPreviewCard audioData={tone.audioData} id={tone.id} title={tone.title} tags={tone.tags} />
                    </CardContent>
                  );
                })
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={uploadModalStatus}
        onClose={handleCloseUploadModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography>
            Are you sure you want to upload <i>{fullPrompt}</i> to the server?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You will be ported to the upload page with relavant information of this audio file. All other generated
            tones will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadModal} variant="contained">
            Exit
          </Button>
          <Button onClick={handleConfirmUpload} variant="outlined" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToneCreationPage;
