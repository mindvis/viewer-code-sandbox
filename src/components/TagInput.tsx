import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import styled from '@emotion/styled'
import {
  Stack,
  TextField
} from '@mui/material';


interface TagInputProps {
  onAddTag?: (tag: string) => void;
}

const StyledChipInput = styled(TextField)({
  // Add custom styles here to match Able Pro Material design (optional)
});

const TagInput: React.FC<TagInputProps> = ({ onAddTag }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // const addTag = (event: React.SyntheticEvent<HTMLButtonElement>) => {
  //   event.preventDefault(); // Prevent form submission default behavior
  //   if (inputValue.trim() && !tags.includes(inputValue.trim())) {
  //     setTags([...tags, inputValue.trim()]);
  //     setInputValue(''); // Clear input value after adding
  //     onAddTag?.(inputValue.trim()); // Call callback function if provided
  //   }
  // };

  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission default behavior
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue(''); // Clear input value after adding
      onAddTag?.(inputValue.trim() as string); // Call callback function if provided
    }
    }
  };


  return (
    <div>
      <Stack spacing={1.5} alignItems="center">
      <StyledChipInput
        label="Tags"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a tag"
        fullWidth
      />
      <br />
      </Stack>
      {tags.length > 0 && (
        <div>
          
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDelete(tag)}
              variant="outlined"
              sx={{ ml: 1.25, pl: 0.5 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
