import { Box, Chip, Tooltip } from '@mui/material';
import { TagProps } from '../types';
import { useState } from 'react';

interface TagChipsProps {
  tags: TagProps[];
  showTooltip?: boolean; // Controls whether tooltips are shown
  handleTagClick: (tag: string) => void;
}

export default function TagChips(props: TagChipsProps) {
  const { tags, showTooltip, handleTagClick } = props;
  const [tagState, setTagState] = useState<string[]>([]);

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
