import React, { useRef, useEffect, useState } from "react";
import {
  FaUndo,
  FaRedo,
  FaArrowsAltH,
  FaAdjust,
  FaFileImport,
} from "react-icons/fa";

const ImageEditor = ({ img }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [image, setImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
    if (img) {
      const imgElement = new Image();
      imgElement.src = img;
      imgElement.onload = () => {
        setImage(imgElement);
        drawImage(ctx, imgElement);
      };
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [img]);

  const drawImage = (ctx, imgElement) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(isMirrored ? -1 : 1, 1);
    ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
    ctx.restore();
    if (isGrayscale) {
      applyGrayscale(ctx);
    }
  };

  const applyGrayscale = (ctx) => {
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    draw(e);
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      draw(e);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    context.beginPath();
  };

  const handleMouseLeave = () => {
    setDrawing(false);
    context.beginPath();
  };

  const draw = (e) => {
    if (!context) return;
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.strokeStyle = color;

    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const mirrorImage = () => {
    setIsMirrored((prev) => !prev);
  };

  const toggleGrayscale = () => {
    setIsGrayscale((prev) => !prev);
  };

  useEffect(() => {
    if (context && image) {
      drawImage(context, image);
    }
  }, [rotation, isMirrored, isGrayscale]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ border: "1px solid black" }}
      />
      <div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
        />
        <button onClick={rotateLeft}>
          <FaUndo></FaUndo> Rotate Left
        </button>
        <button onClick={rotateRight}>
          <FaRedo /> Rotate Right
        </button>
        <button onClick={mirrorImage}>
          <FaArrowsAltH /> Mirror
        </button>
        <button onClick={toggleGrayscale}>
          <FaAdjust /> Grayscale
        </button>
      </div>
    </div>
  );
};

export default ImageEditor;
