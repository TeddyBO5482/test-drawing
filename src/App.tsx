import React, { useState, useRef } from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Tooltip, TextField } from '@mui/material';
import ImageUploader from './components/ImageUploader.tsx';
import DrawingCanvas from './components/DrawingCanvas.tsx';

const getButtonStyles = (isActive: boolean) => ({
  backgroundColor: "#e0e0e0",
  color: isActive ? "#1976d2" : "#757575",
  '&:hover': {
    backgroundColor: isActive ? "#d6d6d6" : "inherit",
  },
});

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [updatedImage, setUpdatedImage] = useState<string | null>(null);
  const [color, setColor] = useState<string>("#ff0000");
  const [hasDrawing, setHasDrawing] = useState<boolean>(false);
  const clearCanvasRef = useRef<() => void>(() => {});

  const resetApp = () => {
    setImage(null);
    setUpdatedImage(null);
    setHasDrawing(false);
  };

  const resetDrawing = () => {
    if (image) {
      clearCanvasRef.current();
      setUpdatedImage(image);
      setHasDrawing(false);
    }
  };

  const downloadImage = () => {
    if (updatedImage) {
      const link = document.createElement('a');
      link.href = updatedImage;
      link.download = 'annotated-image.png';
      link.click();
    }
  };

  const renderButton = (
    label: string,
    onClick: () => void,
    isActive: boolean,
    tooltip: string = ''
  ) => (
    <Tooltip title={tooltip} arrow disableHoverListener={isActive}>
      <span>
        <Button
          onClick={onClick}
          disabled={!isActive}
          sx={getButtonStyles(isActive)}
          style={{ marginBottom: '10px' }}
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Test Task
          </Typography>
          {renderButton('Clear', resetApp, !!image, 'You need to add an image')}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {image && (
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <Box
                component="img"
                src={updatedImage || image}
                alt="Preview"
                sx={{
                  maxWidth: '300px',
                  maxHeight: '300px',
                  border: '1px solid #ccc',
                  boxShadow: 3,
                  mb: '15px',
                }}
              />
            </div>
            <TextField
              label="Color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              sx={{ pb: '15px', width: '100px', textAlign: 'center' }}
            />
            {renderButton('Reset Drawing', resetDrawing, hasDrawing)}
            {renderButton('Download Image', downloadImage, hasDrawing)}
          </Box>
        )}
        {image && (
          <Box sx={{ flexGrow: 1, height: '100%', position: 'relative', overflow: 'hidden' }}>
            <DrawingCanvas
              imageSrc={image}
              color={color}
              onCanvasUpdate={(updated, changes) => {
                setUpdatedImage(updated);
                setHasDrawing(changes);
              }}
              onClearCanvasRequest={(clearFunction) => (clearCanvasRef.current = clearFunction)}
            />
          </Box>
        )}
        {!image && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', marginTop: '25px' }}>
            <ImageUploader onImageUpload={setImage} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default App;
