import React, { useState } from 'react';
import './Carousel.css'; // Import styles
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { ListItem, Avatar, ListItemAvatar } from '@mui/material';
import { usePlayer } from '../contexts/PlayerContext';
import { SoundTrack } from './SearchBar';
import handlePlay from '/.SearchBar';

const port = import.meta.env.VITE_BACKEND_PORT || 3000;

let currentAudioElement: HTMLAudioElement | null = null;

interface CarouselProps {
  items: { _id: string; audioFileId: string; imageFileId: string; title: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  console.log("ITEMS" + items);

  console.log("ITEMS" + items);

  const [currentIndex, setCurrentIndex] = useState(0);
  //console.log(currentIndex);
  //console.log(currentIndex);

  // Go to the next item in the carousel
  const nextItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    //console.log(`http://localhost:${port}/api/audio/image/`+items[currentIndex].imageFileId);
    console.log(items[currentIndex]._id);
    //console.log(`http://localhost:${port}/api/audio/image/`+items[currentIndex].imageFileId);
    console.log(items[currentIndex]._id);
  };

  // Go to the previous item in the carousel
  const prevItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  interface PlayProps {
    handlePlay: (track: SoundTrack) => void;
  }

  const playSong = async() => {
    // TO IMPLEMENT
    const apiURL = "http://localhost:" + import.meta.env.VITE_BACKEND_PORT + "/api/audio/stream/"+items[currentIndex].audioFileId;
    console.log(apiURL);

    let response = null;

    try {
      response = await fetch(apiURL)
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('failed to load audio');
      })
      .then(blob => {

        if (currentAudioElement) {
          currentAudioElement.pause();
          currentAudioElement.currentTime = 0;
          currentAudioElement.remove();

          const prevAudioUrl = currentAudioElement.querySelector('source')?.src;
          if (prevAudioUrl && prevAudioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(prevAudioUrl);  // Release the Blob URL memory
          }
        }

        const audioUrl = URL.createObjectURL(blob);
        currentAudioElement = document.createElement('audio');
        const audioSource = document.createElement('source');

        audioSource.src = audioUrl;

        currentAudioElement.appendChild(audioSource);

        currentAudioElement.controls = true;

        document.body.appendChild(currentAudioElement);

        currentAudioElement.play()
        .then(() => {
          console.log('playing audio...');
        })
        .catch(err => {
          console.log('error playing audio',err);
        })
      })
    }
    catch {
      console.log('error streaming audio file');
    }
    console.log(response);
    const apiURL = "http://localhost:" + import.meta.env.VITE_BACKEND_PORT + "/api/audio/stream/"+items[currentIndex].audioFileId;
    console.log(apiURL);

    let response = null;

    try {
      response = await fetch(apiURL)
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('failed to load audio');
      })
      .then(blob => {

        if (currentAudioElement) {
          currentAudioElement.pause();
          currentAudioElement.currentTime = 0;
          currentAudioElement.remove();

          const prevAudioUrl = currentAudioElement.querySelector('source')?.src;
          if (prevAudioUrl && prevAudioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(prevAudioUrl);  // Release the Blob URL memory
          }
        }

        const audioUrl = URL.createObjectURL(blob);
        currentAudioElement = document.createElement('audio');
        const audioSource = document.createElement('source');

        audioSource.src = audioUrl;

        currentAudioElement.appendChild(audioSource);

        currentAudioElement.controls = true;

        document.body.appendChild(currentAudioElement);

        currentAudioElement.play()
        .then(() => {
          console.log('playing audio...');
        })
        .catch(err => {
          console.log('error playing audio',err);
        })
      })
    }
    catch {
      console.log('error streaming audio file');
    }
    console.log(response);
  };
  
  return (
    <div className="carousel-container">
      <button className="carousel-button prev" onClick={prevItem}>
        &#8592;
      </button>
      <div className="carousel-items">
        <div className="carousel-item">
          <ListItem 
              sx={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                width: '100%', // Ensure the ListItem takes full width if needed
              }}
            >
              <ListItemAvatar>
                {items[currentIndex].imageFileId ? (
                  <Avatar 
                    alt={items[currentIndex].title}
                    src={`http://localhost:${port}/api/audio/image/${items[currentIndex].imageFileId}`}
                    variant="rounded"
                    sx={{ width: 320, height: 320 }}
                  />
                ) : (
                  <Avatar 
                    alt="Music Icon" 
                    variant="rounded"
                    sx={{ width: 320, height: 320, bgcolor: 'primary.light' }}
                  >
                    <MusicNoteIcon sx={{ fontSize: 320 }} />
                  </Avatar>
                )}
              </ListItemAvatar>
            </ListItem>
          <button className="carousel-button play-button" onClick={playSong}/>
          <ListItem 
              sx={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                width: '100%', // Ensure the ListItem takes full width if needed
              }}
            >
              <ListItemAvatar>
                {items[currentIndex].imageFileId ? (
                  <Avatar 
                    alt={items[currentIndex].title}
                    src={`http://localhost:${port}/api/audio/image/${items[currentIndex].imageFileId}`}
                    variant="rounded"
                    sx={{ width: 320, height: 320 }}
                  />
                ) : (
                  <Avatar 
                    alt="Music Icon" 
                    variant="rounded"
                    sx={{ width: 320, height: 320, bgcolor: 'primary.light' }}
                  >
                    <MusicNoteIcon sx={{ fontSize: 320 }} />
                  </Avatar>
                )}
              </ListItemAvatar>
            </ListItem>
          <button className="carousel-button play-button" onClick={playSong}/>
          <h3>{items[currentIndex].title}</h3>
        </div>
      </div>
      <button className="carousel-button next" onClick={nextItem}>
        &#8594;
      </button>
    </div>
  );
  
  
};

export default Carousel;
