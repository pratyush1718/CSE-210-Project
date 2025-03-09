import React, { useState, useEffect } from "react";
import { 
  TextField, Button, RadioGroup, FormControlLabel, Radio, 
  Typography, Box, Paper, IconButton, Grid2 as Grid,
  Stack,
  Chip
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { MUSIC_AMBIANCES, MUSIC_SCENARIOS, MUSIC_STYLES, PREDEFINED_TAGS } from "../assets/constants";
import useUploadStore from "../stores/useUploadState";
import { auth } from "../firebase";
import { User } from "firebase/auth";
import { uploadDispatcher } from "../controller/uploadDispatcher";
import TagChips from "../components/TagChips";

const UploadPage: React.FC = () => {
  const { title, setTitle, audioFile, setAudioFile, tags, clear } = useUploadStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [allowDownloads, setAllowDownloads] = useState("no");
  const [audioTags, setAudioTags] = useState(tags);
  const user: User | null = auth.currentUser;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "audio" | "image") => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (type === "audio" && ["audio/mpeg", "audio/wav"].includes(file.type)) {
        setAudioFile(file);
      } else if (type === "image" && ["image/jpeg", "image/png"].includes(file.type)) {
        setImageFile(file);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    setAudioTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
    // console.log(audioTags)
  };

  const handleUpload = async () => {
    if (!user) {
        alert('User is not signed in.');
        return;
    }
    if (!audioFile || !title || !description) {
        alert("Please upload an audio file and fill in the required fields.");
        return;
    }

    // console.log("Uploading data...");
    // console.log("Audio File:", audioFile.name);
    // if (imageFile) {
    //     console.log("Image File:", imageFile.name);
    // } else {
    //     console.log("No Image File Uploaded.");
    // }
    // console.log("Title:", title);
    // console.log("Description:", description);
    // console.log("Tags:", JSON.stringify(tags));
    // console.log("Location:", location);
    // console.log("Visibility:", visibility);
    // console.log("Allow Downloads:", allowDownloads);
  
    const formData = new FormData();
    formData.append("audioFile", audioFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("allowDownloads", (allowDownloads==="yes").toString());
    formData.append('creator', user.uid)
    if (audioTags.length > 0) {
        formData.append("tags", JSON.stringify(audioTags));
    }
    if (location.trim() !== "") {
        formData.append("location", location);
    }
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }

    const uploadSuccess = await uploadDispatcher(formData);
    if (uploadSuccess) {
        clear();
        window.location.reload();
    }
  };
  



  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={10}>
        {/* Uploaders */}
        <Grid size={{ xs: 12, md: 4, lg: 4, xl: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10%',
              height: '100%',
            }}
          >
            {/* Upload Audio */}
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '40%',
              }}
            >
              <Typography variant="subtitle1">Upload your tone*</Typography>
              <Typography variant="subtitle2">Supported: MP3, WAV</Typography>
              <input
                type="file"
                accept="audio/mp3, audio/wav"
                style={{ display: 'none' }}
                id="audio-upload"
                onChange={(e) => handleFileChange(e, 'audio')}
              />
              <label htmlFor="audio-upload" style={{ textAlign: 'center' }}>
                <IconButton component="span">
                  <UploadFileIcon fontSize="large" />
                </IconButton>
                <Typography>{audioFile ? audioFile.name : 'Drag & Drop or Click to Upload'}</Typography>
              </label>
            </Paper>

            {/* Upload Image */}
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '40%',
              }}
            >
              <Typography variant="subtitle1">Upload a teaser for your tone</Typography>
              <Typography variant="subtitle2">Supported: JPEG, PNG</Typography>
              <input
                type="file"
                accept="image/jpeg, image/png"
                style={{ display: 'none' }}
                id="image-upload"
                onChange={(e) => handleFileChange(e, 'image')}
              />
              <label htmlFor="image-upload" style={{ textAlign: 'center' }}>
                <IconButton component="span">
                  <UploadFileIcon fontSize="large" />
                </IconButton>
                <Typography>{imageFile ? imageFile.name : 'Drag & Drop or Click to Upload'}</Typography>
              </label>
            </Paper>
          </Box>
        </Grid>

        {/* Inputs */}
        <Grid size={{ xs: 12, md: 8, lg: 8, xl: 8 }}>
          <Typography variant="h5" gutterBottom>
            Upload your StressTone
          </Typography>

          {/* Title */}
          <TextField
            label="StressTone Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Tags */}
          <Typography variant="subtitle1">Select Tags:</Typography>
          <Stack direction="column" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <TagChips tags={MUSIC_STYLES} handleTagClick={handleTagClick} />
            <TagChips tags={MUSIC_AMBIANCES} handleTagClick={handleTagClick} />
            <TagChips tags={MUSIC_SCENARIOS} handleTagClick={handleTagClick} />
            {/* <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              {MUSIC_STYLES.map((tag) => (
                <Chip
                  key={tag.type}
                  label={tag.type}
                  clickable
                  onClick={() => handleTagClick(tag.type)}
                  color={audioTags.includes(tag.type) ? 'primary' : 'default'}
                />
              ))}
            </Stack> */}
          </Stack>

          {/* Location */}
          <TextField
            label="Location (Optional)"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={4}>
            <Grid>
              {/* Visibility */}
              <Typography variant="subtitle1">Visibility:</Typography>
              <RadioGroup row value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <FormControlLabel value="public" control={<Radio />} label="Public" />
                <FormControlLabel value="private" control={<Radio />} label="Private" />
              </RadioGroup>
            </Grid>

            <Grid>
              {/* Allow Downloads */}
              <Typography variant="subtitle1">Allow Downloads:</Typography>
              <RadioGroup row value={allowDownloads} onChange={(e) => setAllowDownloads(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>

            <Grid>
              {/* Upload Button */}
              <Button variant="contained" color="primary" fullWidth onClick={handleUpload} sx={{ mt: 3 }}>
                Upload
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadPage;
