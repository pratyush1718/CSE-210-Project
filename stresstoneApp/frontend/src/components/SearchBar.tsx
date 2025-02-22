import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { TextField, CircularProgress, Alert, List, ListItem, ListItemText, IconButton, Tooltip, Box } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface SoundTrack {
  _id: string;
  title: string;
  description?: string;
}

type SortOption = 'relevance' | 'likes' | 'recent';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SoundTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== '') {
        setLoading(true);
        axios
          .get('http://localhost:3000/api/search', { params: { q: query /*, sort: sortOption*/ } })
          .then((res) => {
            setResults(res.data.results);
            setError('');
          })
          .catch(() => {
            setError('Error fetching results');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, sortOption]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <TextField
        label="Search for sound tracks"
        variant="outlined"
        fullWidth
        value={query}
        onChange={handleChange}
        margin="normal"
      />
      {/* Filter Icons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <Tooltip title="Most Relevant">
          <IconButton
            onClick={() => setSortOption('relevance')}
            sx={{ backgroundColor: sortOption === 'relevance' ? '#e0e0e0' : 'inherit' }}
          >
            <SortIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Most Likes">
          <IconButton
            onClick={() => setSortOption('likes')}
            sx={{ backgroundColor: sortOption === 'likes' ? '#e0e0e0' : 'inherit' }}
          >
            <ThumbUpAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Most Recent">
          <IconButton
            onClick={() => setSortOption('recent')}
            sx={{ backgroundColor: sortOption === 'recent' ? '#e0e0e0' : 'inherit' }}
          >
            <AccessTimeIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {results.length > 0 && (
        <List>
          {results.map((track) => (
            <ListItem key={track._id}>
              <ListItemText
                primary={track.title}
                secondary={track.description ? `- ${track.description}` : null}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default SearchBar;