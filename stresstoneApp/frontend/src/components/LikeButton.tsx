// File: stresstoneApp/frontend/src/components/LikeButton.tsx
import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

interface LikeButtonProps {
  trackId: string;
  initialLikeCount: number;
  userId: string; // In production, you'd get this from auth context
}

const LikeButton: React.FC<LikeButtonProps> = ({ trackId, initialLikeCount, userId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check initial like status
    const checkLikeStatus = async () => {
      try {
        const response = await axios.get(`/api/likes/${trackId}/status?userId=${userId}`);
        setLiked(response.data.liked);
        setLikeCount(response.data.likes);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [trackId, userId]);

  const handleToggleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.post(`/api/likes/${trackId}`, { userId });
      setLiked(response.data.liked);
      setLikeCount(response.data.likes);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={liked ? 'Unlike' : 'Like'}>
      <IconButton color={liked ? 'primary' : 'default'} onClick={handleToggleLike} disabled={loading}>
        <Badge badgeContent={likeCount} color="primary">
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default LikeButton;
