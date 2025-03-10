// File: stresstoneApp/frontend/src/components/LikeButton.tsx
import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

interface LikeButtonProps {
  trackId: string;
  initialLikeCount: number;
  firebaseId: string; // Changed from userId to firebaseId
}

const LikeButton: React.FC<LikeButtonProps> = ({ trackId, initialLikeCount, firebaseId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const port = import.meta.env.VITE_BACKEND_PORT || 3000;

  useEffect(() => {
    // Check initial like status using firebaseId
    const checkLikeStatus = async () => {
      if (!firebaseId) return;
      
      try {
        const response = await axios.get(
          `http://localhost:${port}/api/likes/${trackId}/status?firebaseId=${firebaseId}`
        );
        setLiked(response.data.liked);
        setLikeCount(response.data.likes);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [trackId, firebaseId, port]);

  const handleToggleLike = async () => {
    if (loading || !firebaseId) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:${port}/api/likes/${trackId}`, 
        { firebaseId }
      );
      setLiked(response.data.liked);
      setLikeCount(response.data.likes);

      await axios.post(
        `http://localhost:${port}/api/tagRouter/userTag/content`, 
        { firebaseId, trackId }
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={liked ? "Unlike" : "Like"}>
      <IconButton
        color={liked ? "primary" : "default"}
        onClick={handleToggleLike}
        disabled={loading || !firebaseId}
      >
        <Badge badgeContent={likeCount} color="primary">
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default LikeButton;
