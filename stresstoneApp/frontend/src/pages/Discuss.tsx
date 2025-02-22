import { Box, Typography, Card, CardContent, Avatar, IconButton, TextField, Button } from '@mui/material';
import { ThumbUp, ThumbDown, Reply, Send } from '@mui/icons-material';

interface Post {
  id: number;
  user: string;
  content: string;
  time: string;
}

const posts: Post[] = [
  { id: 1, user: 'Kyrian', content: "Loving this new track by @Bella! It's so chill! Have you guys heard it yet?", time: "3 minutes ago" },
  { id: 2, user: 'Brian', content: "What should I make for my next track? Trying to decide between Christmas and fall vibes.", time: "10 minutes ago" },
  { id: 3, user: 'Bella', content: "Hey guys, new track is out! Make sure to check it out!", time: "23 hours ago" },
  { id: 4, user: 'Angie', content: "Been looking for some new tracks to decompress after work. Any recs?", time: "Feb 10, 2025" },
];

export default function Discuss() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Community Discussion
      </Typography>

      {/* Post Button */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {/* <TextField fullWidth label="Write a post..." variant="outlined" /> */}
        <Button variant="contained" startIcon={<Send />}>Post</Button>
      </Box>

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
              <IconButton><ThumbUp /></IconButton>
              <IconButton><ThumbDown /></IconButton>
              <IconButton><Reply /></IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
