import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface SoundTrack {
  _id: string;
  title: string;
  description?: string;
  // include any other fields you expect from the API
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SoundTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // debounce the input change by 500ms
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== '') {
        setLoading(true);
        axios
          .get('http://localhost:3000/search', { params: { q: query } })
          .then(res => {
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
  }, [query]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for sound tracks..."
        value={query}
        onChange={handleChange}
      />
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {results.length > 0 && (
        <ul>
          {results.map((track) => (
            <li key={track._id}>
              {track.title}
              {track.description && <> - {track.description}</>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;