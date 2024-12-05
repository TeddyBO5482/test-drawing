import { useRef, useState, useEffect } from 'react';

export const calculateCanvasHeight = (canvasWidth: number, image: HTMLImageElement) => {
  const aspectRatio = image.width / image.height;
  return canvasWidth / aspectRatio;
};

export const getMousePosition = (
  event: React.MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

export const useDrawingCanvas = (
  imageSrc: string,
  onCanvasUpdate: (updatedImage: string, hasDrawing: boolean) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  const drawImage = (resetHasDrawing: boolean = true) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
          const canvasHeight = calculateCanvasHeight(canvas.width, image);
          canvas.height = canvasHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          if (resetHasDrawing) {
            setHasDrawing(false);
            onCanvasUpdate(canvas.toDataURL(), false);
          }
        };
      }
    }
  };

  const startDrawing = (event: React.MouseEvent) => {
    setIsDrawing(true);
    const position = getMousePosition(event, canvasRef);
    setLastPosition(position);
  };

  const draw = (x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && lastPosition) {
        ctx.beginPath();
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        setLastPosition({ x, y });
        setHasDrawing(true);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent, color: string) => {
    if (!isDrawing) return;

    const position = getMousePosition(event, canvasRef);
    draw(position.x, position.y, color);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);

    if (canvasRef.current) {
      onCanvasUpdate(canvasRef.current.toDataURL(), hasDrawing);
    }
  };

  useEffect(() => {
    drawImage();
  }, [imageSrc]);

  return {
    canvasRef,
    startDrawing,
    handleMouseMove,
    stopDrawing,
    drawImage,
  };
};
