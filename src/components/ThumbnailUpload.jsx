import React, { useEffect, useState } from "react";
import { FaImage, FaUpload } from "react-icons/fa";
import "../styles/ThumbnailUpload.scss";

const ThumbnailUpload = ({ thumbnail, setThumbnail, setGoBackText, maxWidth, maxHeight, buttonText = "Upload Image", borderRadius = 0, width, height }) => {
  const [preview, setPreview] = useState("");
  const [displaySelected, setDisplaySelected] = useState(false)

  useEffect(() => {
    if (thumbnail instanceof File) {
      const objectUrl = URL.createObjectURL(thumbnail);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(thumbnail);
    }
  }, [thumbnail]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setDisplaySelected(true)
    setGoBackText && setGoBackText("Go Back (Discard Changes)");
  };

  return (
    <>
      <label className="flex items-center justify-center editLabel">
        Image preview
        <FaImage className="m-1" />
      </label>
      {preview && <div>
        {displaySelected && 
            <p className="mt-2 text-sm text-center m-3">
                Selected: <strong>{thumbnail.name}</strong> ({(thumbnail.size / 1024 / 1024).toFixed(2)} MB)
            </p>
        }
        
        <img src={preview} className="thumbnailPreview" style={{maxHeight: maxHeight, maxWidth: maxWidth, borderRadius: borderRadius, width: width, height: height}}/>
      </div>}
      <div className="flex items-center gap-2">
        <label className="imgInput">
          <FaUpload className="m-1" /> {!buttonText ? (<p>Upload new image</p>): (<p>{buttonText}</p>)}
          <input
            hidden
            type="file"
            accept=".png,.jpg,.jpeg"
            className="mt-1"
            onChange={handleUpload}
          />
        </label>
      </div>
    </>
  );
};

export default ThumbnailUpload;
