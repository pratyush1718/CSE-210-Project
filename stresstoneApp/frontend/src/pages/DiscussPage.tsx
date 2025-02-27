import { useState } from 'react';
import { 
  Box, Fab, Typography, Card, CardContent, Avatar, IconButton, 
  Button, Tooltip, Modal, TextField, InputAdornment
} from '@mui/material';
import { ThumbUp, ThumbDown, Reply, Add, Close, Delete, Send } from '@mui/icons-material';

interface Reply {
  id: number;
  user: string;
  content: string;
  time: string;
}

interface Post {
  id: number;
  user: string;
  content: string;
  time: string;
  likeCount: number;
  dislikeCount: number;
  replies: Reply[];
}

const postsData: Post[] = [
  { 
    id: 1, 
    user: 'Kyrian', 
    content: "Loving this new track by @Bella! It's so chill! Have you guys heard it yet?", 
    time: "3 minutes ago", 
    likeCount: 5, 
    dislikeCount: 1, 
    replies: [
        { id: 1, user: 'Bella', content: "Thanks so much! I'm glad you like it!", time: "1 minute ago" },
        { id: 2, user: 'Kyrian', content: "Of course! Keep up the great work!", time: "Just now" },
    ],
  },
  { 
    id: 2, 
    user: 'Brian', 
    content: "What should I make for my next track? Trying to decide between Christmas and fall vibes.", 
    time: "10 minutes ago", 
    likeCount: 3, 
    dislikeCount: 2, 
    replies: [
        { id: 1, user: 'Angie', content: "I think a Christmas track would be really fun!", time: "5 minutes ago" },
    ],
  },
  { 
    id: 3, 
    user: 'Bella', 
    content: "Hey guys, new track is out! Make sure to check it out!", 
    time: "23 hours ago", 
    likeCount: 3, 
    dislikeCount: 0, 
    replies: []
  },
  { 
    id: 4, 
    user: 'Angie', 
    content: "Been looking for some new tracks to decompress after work. Any recs?", 
    time: "Feb 10, 2025", 
    likeCount: 1, 
    dislikeCount: 0, 
    replies: [
      { id: 1, user: 'Vanessa', content: "Ohh, I've been cooking something up. Just you wait!", time: "Feb 10, 2025" },
      { id: 2, user: 'Simon', content: "Try out the Tone Creator! I've been making so many great sounds, I'll never run out things to listen to!", time: "Feb 10, 2025" },
      { id: 3, user: 'Kyrian', content: "I've been listening to @Bella's new track on repeat! It's so calming.", time: "2 hours ago" },
    ]
  },
];

export default function Discuss() {
  const [posts, setPosts] = useState(postsData);
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
  const [dislikedPosts, setDislikedPosts] = useState<{ [key: number]: boolean }>({});
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Track visibility of reply boxes
  const [replyEntryVisibility, setReplyEntryVisibility] = useState<{ [key: number]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [repliesVisibility, setRepliesVisibility] = useState<{ [key: number]: boolean }>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreatePost = () => {
    if (newPostContent.trim() === "") return;
    
    const newPost: Post = {
      id: posts.length + 1,
      user: 'You',
      content: newPostContent,
      time: "Just now",
      likeCount: 0,
      dislikeCount: 0,
      replies: [],
    };

    setPosts([newPost, ...posts]);
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

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likeCount: likedPosts[postId] ? post.likeCount - 1 : post.likeCount + 1 }
          : post
      )
    );

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };

  const handleDislike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, dislikeCount: dislikedPosts[postId] ? post.dislikeCount - 1 : post.dislikeCount + 1 }
          : post
      )
    );

    setDislikedPosts((prevDislikedPosts) => ({
      ...prevDislikedPosts,
      [postId]: !prevDislikedPosts[postId],
    }));
  };

  // Handle showing reply box
  const toggleReplyEntryBox = (postId: number) => {
    setReplyEntryVisibility((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Handle typing in the reply box
  const handleReplyChange = (postId: number, content: string) => {
    setReplyContent((prev) => ({
      ...prev,
      [postId]: content,
    }));
  };

  const toggleReplies = (postId: number) => {
    setRepliesVisibility((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Community Discussion
      </Typography>

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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
              <Tooltip title="Like">
                <IconButton 
                  size="small" 
                  onClick={() => handleLike(post.id)} 
                  sx={{ color: likedPosts[post.id] ? "blue" : "inherit" }}
                >
                  <ThumbUp fontSize="small" />
                  <Typography variant="body2" paddingLeft={1}>{post.likeCount}</Typography>
                </IconButton>
              </Tooltip>

              <Tooltip title="Dislike">
                <IconButton 
                  size="small" 
                  onClick={() => handleDislike(post.id)} 
                  sx={{ color: dislikedPosts[post.id] ? "red" : "inherit" }}
                >
                  <ThumbDown fontSize="small" />
                  <Typography variant="body2" paddingLeft={1}>{post.dislikeCount}</Typography>
                </IconButton>
              </Tooltip>

              <Tooltip title="Reply">
                <IconButton 
                size="small"
                onClick={() => toggleReplyEntryBox(post.id)}
                >
                  <Reply fontSize="small" />
                  <Typography variant="body2" paddingLeft={1}>{post.replies.length}</Typography>
                </IconButton>
              </Tooltip>

              {post.replies.length > 0 && (
                <Button 
                size="small"
                onClick={() => toggleReplies(post.id)}
                >
                  {repliesVisibility[post.id] ? "Hide Replies" : "View Replies"}
                </Button>
              )}

              {post.user === 'You' && (
                <Tooltip title="Delete Post">
                  <IconButton size="small" onClick={() => handleDeletePost(post)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

            </Box>

            {/* Replies */}
            {repliesVisibility[post.id] && (
              <Box sx={{ mt: 2, ml: 2}}>
                {post.replies.map((reply, index) => (
                  <Box 
                    key={reply.id} 
                    sx={{ 
                      mt: 1, 
                      pb: 1, // Padding at the bottom for spacing
                      borderBottom: index !== post.replies.length - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none' 
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {reply.user}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • {reply.time}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {reply.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Reply Entry Box */}
            {replyEntryVisibility[post.id] && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
              <TextField
                fullWidth
                multiline
                rows={1}
                variant="outlined"
                placeholder="Write a reply..."
                value={replyContent[post.id] || ""}
                onChange={(e) => handleReplyChange(post.id, e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => { /* Handle reply submit */ }}>
                        <Send />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Tooltip title="Create Post" placement='top'>
        <Fab color="primary" sx={{ position: "fixed", bottom: 130, right: 24 }} onClick={handleOpen}>
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
            <Button onClick={() => { handleCreatePost(); handleClose(); }} color="primary">
              Post
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteOpen} onClose={cancelDeletePost}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
          <Typography>Are you sure you want to delete this post?</Typography>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button onClick={cancelDeletePost} >Cancel</Button>
            <Button onClick={confirmDeletePost} color="error">Delete</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
