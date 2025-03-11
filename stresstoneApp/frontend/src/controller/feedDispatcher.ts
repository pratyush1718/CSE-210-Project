import axios from 'axios';
import { Post } from '../types';

export async function getPosts() {
  const PORT = import.meta.env.VITE_BACKEND_PORT || 3000;
  const API_URL = `http://localhost:${PORT}/api`;
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return null;
  }
}

export async function postPost(firebaseId: string, newPostContent: string) {
  const PORT = import.meta.env.VITE_BACKEND_PORT || 3000;
  const API_URL = `http://localhost:${PORT}/api`;
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userFirebaseId: firebaseId,
        content: newPostContent,
      }),
    });

    // Refresh posts to include the new one
    if (response.ok) {
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error creating post:', err);
    return false;
  }
}

export async function deleteReply(replyId: string) {
  const PORT = import.meta.env.VITE_BACKEND_PORT || 3000;
  const API_URL = `http://localhost:${PORT}/api`;
  try {
    await axios.delete(`${API_URL}/replies/${replyId}`);
    return true;
  } catch (err) {
    return false;
  }
}

export async function deletePost(postId: string) {
  const PORT = import.meta.env.VITE_BACKEND_PORT || 3000;
  const API_URL = `http://localhost:${PORT}/api`;
  try {
    await axios.delete(`${API_URL}/posts/${postId}`);
    return true;
  } catch (err) {
    return false;
  }
}

export async function postReply(postId: string, firebaseId: string, replyContent: string) {
  const PORT = import.meta.env.VITE_BACKEND_PORT || 3000;
  const API_URL = `http://localhost:${PORT}/api`;
  try {
    const response = await fetch(`${API_URL}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId,
        userFirebaseId: firebaseId,
        content: replyContent,
      }),
    });

    if (response.ok) {
      return true;
    }
    return false;
    // Refresh posts to include the new reply
  } catch (err) {
    console.error('Error creating reply:', err);
    return false;
  }
}
