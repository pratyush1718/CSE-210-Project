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
  Tooltip, 
  Box, 
  Button, 
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface SoundTrack {
  _id: string;
  title: string;
  description?: string;
  creator?: { name: string };
  likes: number;
  createdAt: string;
}

type SortOption = 'relevance' | 'likes' | 'recent';

const resultsPerPage = 10;

const SearchBar: React.FC = () => {
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
        axios
          .get('http://localhost:3000/api/search', { 
            params: { 
              q: query, 
              sort: sortOption,
              page: currentPage, 
              limit: resultsPerPage 
            }
          })
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

  const totalPages = Math.ceil(totalResults / resultsPerPage);

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
          {sortOption === 'likes' ? (
            <ThumbUpAltIcon />
          ) : sortOption === 'recent' ? (
            <AccessTimeIcon />
          ) : (
            <SortIcon />
          )}
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
            <ListItem key={track._id}>
              <ListItemText
                primary={track.title}
                secondary={
                  <>
                    {track.creator?.name && <>Author: {track.creator.name} | </>}
                    Likes: {track.likes} | Published: {new Date(track.createdAt).toLocaleString()}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Pagination controls */}
      {results.length > 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
        >
          {/* Previous arrow */}
          <IconButton 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
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