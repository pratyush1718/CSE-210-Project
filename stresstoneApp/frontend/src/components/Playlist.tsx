import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';
import {auth} from '../firebase'
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { ListItem, Avatar, ListItemAvatar } from '@mui/material';

const Playlist: React.FC = () => {
  // set items will set the id and imageURL and title, NOT IMPLEMENTED YET

  const apiURL = "http://localhost:" + import.meta.env.VITE_BACKEND_PORT + "/api/playlist/liked";
  console.log(apiURL);

  const userID = auth.currentUser?.uid;

  const [items, setItems] = useState([]);

  console.log("FOLLOW FORMAT");
  console.log(items);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.post(apiURL, {
          firebaseId : userID
        });
        console.log('Response status:', response.status);
        console.log(response.data);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    fetchPlaylist();
  }, []);
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {items.map((song) => (
          <Grid item xs={12} sm={6} md={4} key={song._id}>
            <Card sx={{ display: 'flex', flexDirection: 'row', height: 100, borderRadius: 6 }}>
              {/* Image of the song */}
              {song.imageFileId ? (
              <Avatar 
                    alt={song.title}
                    src={`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/api/audio/image/${song.imageFileId}`}
                    variant="rounded"
                    sx={{ width: 100, height: 100, borderRadius: '16px'}}
                  />
                ) : (
                  <Avatar 
                    alt="Music Icon" 
                    variant="rounded"
                    sx={{ width: 100, height: 100, borderRadius: '16px', bgcolor: 'primary.light' }}
                  >
                    <MusicNoteIcon sx={{ fontSize: 100 }} />
                  </Avatar>
                )
              }
              {/* Box for the text content */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 2, flexGrow: 1 }}>
                <CardContent sx={{ padding: 0 }}>
                  <Typography variant="h6" component="div">
                    {song.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {song.artist}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Playlist;