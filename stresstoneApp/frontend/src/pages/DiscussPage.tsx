import { useState } from 'react';
import { Box, Fab, Typography, Card, CardContent, Avatar, IconButton, Button, Tooltip, Modal, TextField } from '@mui/material';
import { ThumbUp, ThumbDown, Reply, Add, Close, Delete } from '@mui/icons-material';

interface Post {
  id: number;
  user: string;
  content: string;
  time: string;
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
}

const postsData: Post[] = [
  { id: 1, user: 'Kyrian', content: "Loving this new track by @Bella! It's so chill! Have you guys heard it yet?", time: "3 minutes ago", likeCount: 5, dislikeCount: 0, replyCount: 2 },
  { id: 2, user: 'Brian', content: "What should I make for my next track? Trying to decide between Christmas and fall vibes.", time: "10 minutes ago", likeCount: 2, dislikeCount: 0, replyCount: 1 },
  { id: 3, user: 'Bella', content: "Hey guys, new track is out! Make sure to check it out!", time: "23 hours ago", likeCount: 3, dislikeCount: 0, replyCount: 0 },
  { id: 4, user: 'Angie', content: "Been looking for some new tracks to decompress after work. Any recs?", time: "Feb 10, 2025", likeCount: 1, dislikeCount: 0, replyCount: 3 },
];

export default function Discuss() {
  const [posts, setPosts] = useState(postsData);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreatePost = () => {
    if (newPostContent.trim() === "") return;
    
    const newPost: Post = {
      id: posts.length + 1,
      user: 'You', // replace this with the logged-in user if needed
      content: newPostContent,
      time: "Just now",
      likeCount: 0,
      dislikeCount: 0,
      replyCount: 0,
    };

    setPosts([newPost, ...posts]); // add new post at the top
    setNewPostContent("");
    handleClose();
  };

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
    setDeleteOpen(true);
  };

  const confirmDeletePost = () => {
    if (postToDelete) {
      setPosts(posts.filter(post => post.id !== postToDelete.id));
    }
    setDeleteOpen(false);
    setPostToDelete(null);
  };

  const cancelDeletePost = () => {
    setDeleteOpen(false);
    setPostToDelete(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Community Discussion
      </Typography>

      {/* Posts List */}
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar>{post.user.charAt(0)}</Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {post.user}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.time}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {post.content}
            </Typography>

            {/* Action Buttons with Counters */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Tooltip title="Like">
                  <IconButton size="small"><ThumbUp fontSize="small" /></IconButton>
                </Tooltip>
                <Typography variant="body2">{post.likeCount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Tooltip title="Dislike">
                  <IconButton size="small"><ThumbDown fontSize="small" /></IconButton>
                </Tooltip>
                <Typography variant="body2">{post.dislikeCount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Tooltip title="Reply">
                  <IconButton size="small"><Reply fontSize="small" /></IconButton>
                </Tooltip>
                <Typography variant="body2">{post.replyCount}</Typography>
              </Box>

              {post.replyCount > 0 && (
                <Button variant="outlined" size="small">View Replies</Button>
              )}

              {/* Delete Button */}
              {post.user === 'You' && (  // Only show delete button for the user who created the post
                <Tooltip title="Delete Post">
                  <IconButton size="small" onClick={() => handleDeletePost(post)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Floating Create Post Button */}
      <Tooltip title="Create Post" placement='top'>
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 130, // distance from the bottom
            right: 24, // distance from the right
            zIndex: 1000,
          }}
          onClick={handleOpen}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Post Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          width: 400,
        }}>
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
            <Button onClick={() => { handleCreatePost(); handleClose(); }} variant="contained" color="primary">
              Post
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Delete Modal */}
      <Modal open={deleteOpen} onClose={cancelDeletePost}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          width: 400,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you want to delete this post?
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={cancelDeletePost} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button onClick={confirmDeletePost} variant="contained" color="primary">
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
