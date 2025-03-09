import { Box, Chip, Tooltip } from '@mui/material';
import { TagProps } from '../types';
import { useEffect, useState } from 'react';

interface TagChipsProps {
  tags: TagProps[];
  showTooltip?: boolean; // Controls whether tooltips are shown
  initialState?: string[]; // Initial state of selected tags
  handleTagClick: (tag: string) => void;
}

export default function TagChips(props: TagChipsProps) {
  const { tags, showTooltip, initialState, handleTagClick } = props;
  const [tagState, setTagState] = useState<string[]>([]);

  useEffect(() => {
    if (initialState) {
      // get intersection between tags and initial state
      const intersection = tags.filter((tag) => initialState.includes(tag.type));
      setTagState(intersection.map((tag) => tag.type));
    }
  }, [initialState, tags]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {tags.map((tag) => (
        <Tooltip
          key={tag.type} // Add key here to avoid React warning
          title={tag.description}
          disableInteractive={!showTooltip} // Disable interactivity if showTooltip is false
          disableHoverListener={!showTooltip} // Disable hover if showTooltip is false
          disableFocusListener={!showTooltip} // Disable focus if showTooltip is false
          disableTouchListener={!showTooltip} // Disable touch if showTooltip is false
        >
          <Chip
            label={tag.type}
            clickable
            onClick={() => {
              handleTagClick(tag.type);
              setTagState((prev) => {
                if (prev.includes(tag.type)) {
                  return prev.filter((t) => t !== tag.type);
                }
                return [...prev, tag.type];
              });
            }}
            color={tagState.includes(tag.type) ? 'primary' : 'default'}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
