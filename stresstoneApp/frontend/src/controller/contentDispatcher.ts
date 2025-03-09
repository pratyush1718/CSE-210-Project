import { SoundTrack } from '../types';

export async function fetchAudio(track: SoundTrack) {
  const port = import.meta.env.VITE_BACKEND_PORT || 3000; // Add fallback port
  
  if (track.audioUrl) {
    try {
      // Ensure the URL is absolute
      let fullAudioUrl = track.audioUrl;
      if (track.audioUrl.startsWith('/')) {
        fullAudioUrl = `http://localhost:${port}${track.audioUrl}`;
      }
      console.log('Attempting to play URL:', fullAudioUrl);
      
      // Verify audio URL is accessible by making a HEAD request
      try {
        await fetch(fullAudioUrl, { method: 'HEAD' });
      } catch (error) {
        console.error('Audio URL not accessible:', error);
        return null;
      }
      
      const playerTrack = {
        _id: track._id,
        title: track.title,
        creator: track.creator,
        audioUrl: fullAudioUrl,
        imageFileId: track.imageFileId,
      };

      return playerTrack;
    } catch (error) {
      console.error('Error preparing track:', error);
      return null;
    }
  }
  return null;
}

export const getImageURL = (imageFileId: string) => {
  const port = import.meta.env.VITE_BACKEND_PORT || 3000;
  const imageURL = `http://localhost:${port}/api/audio/image/${imageFileId}`;
  return imageURL;
};
