import React from 'react';
import { useDrawingCanvas } from '../hooks/useDrawingCanvas.ts';

interface DrawingCanvasProps {
  imageSrc: string;
  color: string;
  onCanvasUpdate: (updatedImage: string, hasDrawing: boolean) => void;
  onClearCanvasRequest?: (clear: () => void) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  imageSrc,
  color,
  onCanvasUpdate,
  onClearCanvasRequest,
}) => {
  const {
    canvasRef,
    startDrawing,
    handleMouseMove,
    stopDrawing,
    drawImage,
  } = useDrawingCanvas(imageSrc, onCanvasUpdate);

  React.useEffect(() => {
    if (onClearCanvasRequest) {
      onClearCanvasRequest(() => drawImage(true));
    }
  }, [onClearCanvasRequest, drawImage]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      style={{ border: '1px solid #ccc', display: 'block' }}
      onMouseDown={startDrawing}
      onMouseMove={(e) => handleMouseMove(e, color)}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    ></canvas>
  );
};

export default DrawingCanvas;
