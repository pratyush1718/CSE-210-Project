import { downloadAudio, fetchTrackAudio } from '../constants';
import { SoundTrack } from '../types';
import { fetchAudio } from './contentDispatcher';

export async function audioDownloadDispatcher(track: SoundTrack) {
  const audioSpec = await fetchAudio(track);
  if (audioSpec?.audioUrl) {
    const audioBuffer = await fetchTrackAudio(audioSpec.audioUrl);
    if (audioBuffer) {
      downloadAudio(audioBuffer);
    }
  }
}


