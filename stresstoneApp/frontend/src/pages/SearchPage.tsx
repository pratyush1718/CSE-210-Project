// File: stresstoneApp/frontend/src/pages/SearchPage.tsx
import React, { useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import useUploadStore from '../stateManagement/useUploadState';

const SearchPage: React.FC = () => {
  const { clear } = useUploadStore();

  useEffect(() => {
    clear();
  }, []);

  return (
    <div>
      <h2>Search Sound Tracks</h2>
      <SearchBar />
    </div>
  );
};

export default SearchPage;
