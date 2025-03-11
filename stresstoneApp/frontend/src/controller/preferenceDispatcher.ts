import axios from 'axios';
import { LikeSpec } from '../types';

export async function getLikeStatus(trackId: string, firebaseId: string) {
  const port = import.meta.env.VITE_BACKEND_PORT || 3000;
  try {
    const response = await axios.get(`http://localhost:${port}/api/likes/${trackId}/status?firebaseId=${firebaseId}`);
    // console.log(response.data)
    return response.data as LikeSpec;
  } catch (error) {
    console.error('Error checking like status:', error);
    return null;
  }
}

export async function postLikeStatus(trackId: string, firebaseId: string) {
  const port = import.meta.env.VITE_BACKEND_PORT || 3000;
  try {
    const response = await axios.post(`http://localhost:${port}/api/likes/${trackId}`, { firebaseId });
    return response.data as LikeSpec;
  } catch (error) {
    console.error('Error posting like status:', error);
    return null
  }
}

export async function updateUserTags(trackId: string, firebaseId: string) {
  const port = import.meta.env.VITE_BACKEND_PORT || 3000;
  await axios.post(`http://localhost:${port}/api/tagRouter/userTag/content`, { firebaseId, trackId });
}
