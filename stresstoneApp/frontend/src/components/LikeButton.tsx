// File: stresstoneApp/frontend/src/components/LikeButton.tsx
import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getLikeStatus, postLikeStatus, updateUserTags } from '../controller/preferenceDispatcher';

interface LikeButtonProps {
  trackId: string;
  initialLikeCount: number;
  firebaseId: string; // Changed from userId to firebaseId
}

const LikeButton: React.FC<LikeButtonProps> = ({ trackId, initialLikeCount, firebaseId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check initial like status using firebaseId
    const checkLikeStatus = async () => {
      if (!firebaseId) return;

      const response = getLikeStatus(trackId, firebaseId);
      response.then((data) => {
        if (data) {
          setLiked(data.liked);
          setLikeCount(data.likes);
        }
      })
    };

    checkLikeStatus();
  }, [trackId, firebaseId]);

  const handleToggleLike = async () => {
    if (loading || !firebaseId) return;
    
    setLoading(true);
    try {
      const response = postLikeStatus(trackId, firebaseId);
      response.then((data) => {
        if (data) {
          setLiked(data.liked);
          setLikeCount(data.likes);
        }
      })
      // setLiked(response.data.liked);
      // setLikeCount(response.data.likes);

      // Update user tag for recommendation use
      updateUserTags(trackId, firebaseId);
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
