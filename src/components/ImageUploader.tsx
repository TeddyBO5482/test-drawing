import React from 'react';
import { Button, Box } from '@mui/material';

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
  resetFlag: boolean;
  setResetFlag: (flag: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onImageUpload(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'flex-start', 
      }}
    >
      <Button
        variant="contained"
        component="label"
      >
        Upload Image
        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
      </Button>
    </Box>
  );
};

export default ImageUploader;
