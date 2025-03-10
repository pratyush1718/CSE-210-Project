import { useState, useEffect } from 'react';
import { 
  Box, Fab, Typography, Card, CardContent, Avatar, IconButton, 
  Button, Tooltip, Modal, TextField, InputAdornment, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ThumbUp, ThumbDown, Reply, Add, Close, Delete, Send } from '@mui/icons-material';
import axios from 'axios';  
import { auth } from '../firebase';

interface User {
  _id: string; 
  email: string; 
  firebaseId: string; 
  username: string; 
  tags: string[]; 
  __v: number; 
}

interface Reply {
  _id: string;
  user: User;
  content: string;
  time: string;
}

interface Post {
  _id: string;
  user: User; 
  content: string;
  time: string;
  likeCount: number;
  dislikeCount: number;
  replies: Reply[];
}


// API base URL - adjust to match your backend
const PORT = import.meta.env.VITE_BACKEND_PORT  || 3000;
const API_URL = `http://localhost:${PORT}/api`;


export default function Discuss() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [dislikedPosts, setDislikedPosts] = useState<{ [key: string]: boolean }>({});
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Track visibility of reply boxes
  const [replyEntryVisibility, setReplyEntryVisibility] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [repliesVisibility, setRepliesVisibility] = useState<{ [key: string]: boolean }>({});

  const currentUserFirebase = auth.currentUser; 
  
  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Create a new post
  const handleCreatePost = async () => {
    if (newPostContent.trim() === '') return;

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userFirebaseId: currentUserFirebase?.uid, 
          content: newPostContent,
          }),
      });

      // Refresh posts to include the new one
      if (response.ok) {
        fetchPosts();
        setNewPostContent('');
        handleClose();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  // Delete a reply
  const handleDeleteReply = async (postId: string, replyId: string) => {
    try {
      await axios.delete(`${API_URL}/replies/${replyId}`);
      fetchPosts(); // Refresh posts to update UI
    } catch (err) {
      console.error('Error deleting reply:', err);
      setError('Failed to delete reply. Please try again.');
    }
  };

  // Set up post for deletion
  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
    setDeleteOpen(true);
  };

  // Confirm post deletion
  const confirmDeletePost = async () => {
    if (postToDelete) {
      try {
        await axios.delete(`${API_URL}/posts/${postToDelete._id}`);
        fetchPosts(); // Refresh posts to update UI
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Failed to delete post. Please try again.');
      }
    }
    setDeleteOpen(false);
    setPostToDelete(null);
  };

  const cancelDeletePost = () => {
    setDeleteOpen(false);
    setPostToDelete(null);
  };

  // Handle likes 
  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, likeCount: likedPosts[postId] ? post.likeCount - 1 : post.likeCount + 1 }
          : post,
      ),
    );

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };

  // Handle dislikes
  const handleDislike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, dislikeCount: dislikedPosts[postId] ? post.dislikeCount - 1 : post.dislikeCount + 1 }
          : post,
      ),
    );

    setDislikedPosts((prevDislikedPosts) => ({
      ...prevDislikedPosts,
      [postId]: !prevDislikedPosts[postId],
    }));
  };

  // Handle showing reply box
  const toggleReplyEntryBox = (postId: string) => {
    setReplyEntryVisibility((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Handle typing in the reply box
  const handleReplyChange = (postId: string, content: string) => {
    setReplyContent((prev) => ({
      ...prev,
      [postId]: content,
    }));
  };

  // Toggle showing replies
  const toggleReplies = (postId: string) => {
    setRepliesVisibility((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Create a new reply
  const handleCreateReply = async (postId: string) => {
    if (!replyContent[postId]?.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId, 
          userFirebaseId: currentUserFirebase?.uid, 
          content: replyContent[postId],
          }),
      });
      
      if (response.ok) {
        fetchPosts();
        
        // Reset reply UI state
        setReplyContent((prev) => ({
          ...prev,
          [postId]: "",
        }));
        toggleReplyEntryBox(postId);
      }
      // Refresh posts to include the new reply
    } catch (err) {
      console.error('Error creating reply:', err);
      setError('Failed to create reply. Please try again.');
    }
  };

  // Format date display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Check if a post or reply is from the current user
  const isCurrentUser = (user: User) => {
    return user.email == currentUserFirebase?.email;
  };

  // Display name for post/reply author
  const getUserDisplayName = (user: User) => {
    return isCurrentUser(user) ? 'You' : user.username;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Community Discussion
      </Typography>

      {/* Error message */}
      {error && (
        <Box sx={{ bgcolor: 'error.light', color: 'error.contrastText', p: 2, borderRadius: 1, mb: 2 }}>
          {error}
        </Box>
      )}

      {/* Loading indicator */}
      {loading ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography>Loading posts...</Typography>
        </Box>
      ) : (
        <>
          {/* Empty state */}
          {posts.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography>No posts yet. Be the first to post!</Typography>
            </Box>
          )}

          {/* Posts list */}
          {posts.map((post) => (
            <Card key={post._id} sx={{ mb: 2, p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>{getUserDisplayName(post.user).charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {getUserDisplayName(post.user)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(post.time)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {post.content}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <Tooltip title="Like">
                    <IconButton
                      size="small"
                      onClick={() => handleLike(post._id)}
                      sx={{ color: likedPosts[post._id] ? 'blue' : 'inherit' }}
                    >
                      <ThumbUp fontSize="small" />
                      <Typography variant="body2" paddingLeft={1}>
                        {post.likeCount}
                      </Typography>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Dislike">
                    <IconButton
                      size="small"
                      onClick={() => handleDislike(post._id)}
                      sx={{ color: dislikedPosts[post._id] ? 'red' : 'inherit' }}
                    >
                      <ThumbDown fontSize="small" />
                      <Typography variant="body2" paddingLeft={1}>
                        {post.dislikeCount}
                      </Typography>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Reply">
                    <IconButton 
                      size="small"
                      onClick={() => toggleReplyEntryBox(post._id)}
                    >
                      <Reply fontSize="small" />
                      <Typography variant="body2" paddingLeft={1}>{post.replies.length}</Typography>
                    </IconButton>
                  </Tooltip>

                  {post.replies.length > 0 && (
                    <Button 
                      size="small"
                      onClick={() => toggleReplies(post._id)}
                    >
                      {repliesVisibility[post._id] ? "Hide Replies" : "View Replies"}
                    </Button>
                  )}

                  {isCurrentUser(post.user) && (
                    <Tooltip title="Delete Post">
                      <IconButton size="small" onClick={() => handleDeletePost(post)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Replies */}
                {repliesVisibility[post._id] && (
                  <Box sx={{ mt: 2, ml: 2 }}>
                    {post.replies.map((reply, index) => {
                      return (
                        <Box
                          key={reply._id}
                          sx={{
                            mt: 1,
                            pb: 1,
                            borderBottom: index !== post.replies.length - 1 ? "1px solid rgba(0, 0, 0, 0.1)" : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {getUserDisplayName(reply.user)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                • {formatDate(reply.time)}
                              </Typography>
                            </Box>
                            <Typography variant="body1">{reply.content}</Typography>
                          </Box>

                          {/* Three-dot menu only shown for current user's replies */}
                          {isCurrentUser(reply.user) && (
                            <Box>
                              <IconButton size="small" onClick={handleMenuOpen}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                                <MenuItem onClick={() => { handleDeleteReply(post._id, reply._id); handleMenuClose(); }}>Delete</MenuItem>
                              </Menu>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Reply Entry Box */}
                {replyEntryVisibility[post._id] && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={1} 
                      maxRows={6} 
                      variant="outlined"
                      placeholder="Write a reply..."
                      value={replyContent[post._id] || ""}
                      onChange={(e) => handleReplyChange(post._id, e.target.value)}
                      InputProps={{
                        sx: { alignItems: "flex-end" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Send" placement='top'>
                              <IconButton size="small" onClick={() => {handleCreateReply(post._id)}}>
                                <Send />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}

      <Tooltip title="Create Post" placement="top">
        <Fab color="primary" sx={{ position: 'fixed', bottom: 130, right: 24 }} onClick={handleOpen}>
          <Add />
        </Fab>
      </Tooltip>

      {/* Post Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Create Post</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button
              onClick={handleCreatePost}
              color="primary"
            >
              Post
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteOpen} onClose={cancelDeletePost}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography>Are you sure you want to delete this post?</Typography>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button onClick={cancelDeletePost}>Cancel</Button>
            <Button onClick={confirmDeletePost} color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}