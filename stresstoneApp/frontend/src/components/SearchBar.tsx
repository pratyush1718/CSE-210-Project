import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import {
  TextField,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { usePlayer } from '../contexts/PlayerContext';
import LikeButton from './LikeButton';
import { SearchSpec, SortOption, SoundTrack } from '../types';
import { RESULTS_PER_PAGE } from '../constants';
import { searchDispatcher } from '../controller/searchDispatcher';
import { fetchAudio } from '../controller/contentDispatcher';


const SearchBar: React.FC = () => {
  const { setCurrentTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SoundTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  // For sort popover menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortClose = () => {
    setAnchorEl(null);
  };
  const handleSortSelect = (option: SortOption) => {
    setSortOption(option);
    setAnchorEl(null);
    setCurrentPage(1); // reset to first page on sort change
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== '') {
        setLoading(true);
        const querySpec = {
          q: query,
          sort: sortOption,
          page: currentPage,
          limit: RESULTS_PER_PAGE,
        } as SearchSpec;
        const searchResult = searchDispatcher(querySpec);
        searchResult
          .then((res) => {
            setResults(res.data.results);
            // If backend sends a total count (e.g., res.data.pagination.totalCount),
            // setTotalResults(res.data.pagination.totalCount);
            // Otherwise, use current page count as a fallback:
            setTotalResults(res.data.results.length);
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
        setTotalResults(0);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, sortOption, currentPage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1); // reset page when query changes
  };

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  const port = import.meta.env.VITE_BACKEND_PORT;

  const handlePlay = (track: SoundTrack) => {
    const playerTrack = fetchAudio(track)
    if (playerTrack) {
      playerTrack.then((track) => {
        setCurrentTrack(track)
        if (!isPlaying) {
          togglePlay()
        }
      })
    }
    else {
      setError(`Failed to play track`);
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search for sound tracks"
          variant="outlined"
          fullWidth
          value={query}
          onChange={handleChange}
          margin="normal"
        />
        {/* Sort icon at the top-right */}
        <IconButton onClick={handleSortClick} sx={{ ml: 2 }}>
          {sortOption === 'likes' ? <ThumbUpAltIcon /> : sortOption === 'recent' ? <AccessTimeIcon /> : <SortIcon />}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleSortClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => handleSortSelect('relevance')}>
            <SortIcon sx={{ mr: 1 }} /> Most Relevant
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('likes')}>
            <ThumbUpAltIcon sx={{ mr: 1 }} /> Most Likes
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('recent')}>
            <AccessTimeIcon sx={{ mr: 1 }} /> Most Recent
          </MenuItem>
        </Menu>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Found message */}
      {results.length > 0 && (
        <Typography variant="caption" display="block" sx={{ my: 1 }}>
          Found {totalResults} related tracks.
        </Typography>
      )}

      {results.length > 0 && (
        <List>
          {results.map((track) => (
            <ListItem
              key={track._id}
              alignItems="flex-start"
              sx={{
                borderBottom: '1px solid #eee',
                py: 1.5,
                bgcolor: isPlaying && currentTrack?._id === track._id ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
              }}
            >
              <ListItemAvatar>
                {track.imageFileId ? (
                  <Avatar
                    alt={track.title}
                    src={`http://localhost:${port}/api/audio/image/${track.imageFileId}`}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                ) : (
                  <Avatar alt="Music Icon" variant="rounded" sx={{ width: 60, height: 60, bgcolor: 'primary.light' }}>
                    <MusicNoteIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={track.title}
                primaryTypographyProps={{ variant: 'h6', sx: { ml: 2 } }}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mt: 0.5 }}>
                    {track.creator?.name && <Typography variant="body2">Author: {track.creator.name} | </Typography>}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThumbUpAltIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{track.likes}</Typography>
                    </Box>
                    <Typography variant="body2">
                      {' '}
                      | Published: {new Date(track.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
                sx={{ ml: 1 }}
              />

              {/* Play button */}
              <IconButton
                color={isPlaying && currentTrack?._id === track._id ? 'primary' : 'default'}
                onClick={() => handlePlay(track)}
                sx={{ ml: 1 }}
              >
                <PlayArrowIcon />
              </IconButton>

              {/* Like button */}
              <LikeButton
                trackId={track._id}
                initialLikeCount={track.likes}
                userId="user-id-here" // Replace with actual user ID from auth
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Pagination controls */}
      {results.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          {/* Previous arrow */}
          <IconButton disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
            <KeyboardArrowLeftIcon />
          </IconButton>

          {/* Page icons */}
          <Box display="flex" gap={1}>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, idx) => idx + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'contained' : 'outlined'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Next arrow */}
          <IconButton
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      )}
    </div>
  );
};

export default SearchBar;
