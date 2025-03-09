import { SoundTrack } from '../types';

export async function fetchAudio(track: SoundTrack) {
  const port = import.meta.env.VITE_BACKEND_PORT;
  if (track.audioUrl) {
    try {
      // Ensure the URL is absolute
      let fullAudioUrl = track.audioUrl;
      if (track.audioUrl.startsWith('/')) {
        fullAudioUrl = `http://localhost:${port}${track.audioUrl}`;
      }
      console.log('Attempting to play URL:', fullAudioUrl);
      const playerTrack = {
        _id: track._id,
        title: track.title,
        creator: track.creator,
        audioUrl: fullAudioUrl,
        imageFileId: track.imageFileId,
      };

      return playerTrack;
    } catch (error) {
      console.error('Error playing track:', error);
      // setError(`Failed to play track: ${error.message}`);
      return null;
    }
  }
  return null;
}

export const getImageURL = (imageFileId: string) => {
  const port = import.meta.env.VITE_BACKEND_PORT;
  const imageURL = `http://localhost:${port}/api/audio/image/${imageFileId}`;
  return imageURL;
};
