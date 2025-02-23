import { Box, Fab, Typography, Card, CardContent, Avatar, IconButton, Button, Tooltip } from '@mui/material';
import { ThumbUp, ThumbDown, Reply, Add } from '@mui/icons-material';

interface Post {
  id: number;
  user: string;
  content: string;
  time: string;
  likes: number; 
  dislikes: number;
  replies: number;
}

const posts: Post[] = [
  { id: 1, user: 'Kyrian', content: "Loving this new track by @Bella! It's so chill! Have you guys heard it yet?", time: "3 minutes ago", likes: 5, dislikes: 0, replies: 2 },
  { id: 2, user: 'Brian', content: "What should I make for my next track? Trying to decide between Christmas and fall vibes.", time: "10 minutes ago", likes: 2, dislikes: 0, replies: 1 },
  { id: 3, user: 'Bella', content: "Hey guys, new track is out! Make sure to check it out!", time: "23 hours ago", likes: 3, dislikes: 0, replies: 0 },
  { id: 4, user: 'Angie', content: "Been looking for some new tracks to decompress after work. Any recs?", time: "Feb 10, 2025", likes: 1, dislikes: 0, replies: 3 },
];

export default function Discuss() {
  const handleCreatePost = () => {
    console.log("Open create modal");
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

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Tooltip title = "Like">
                <IconButton><ThumbUp /></IconButton> 
              </Tooltip>
              <Tooltip title = "Dislike">
                <IconButton><ThumbDown /></IconButton>
              </Tooltip>
              <Tooltip title = "Reply">
                <IconButton><Reply /></IconButton>
              </Tooltip>
              <Button variant="outlined">View Replies</Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      { /* Floating Create Post Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 130, // distance from the bottom
          right: 24,  // distance from the right
          zIndex: 1000,
        }}
        onClick={handleCreatePost}
      >
        <Add />
      </Fab>
    </Box>
  );
}
