import React, { useEffect } from "react";
import { FaImage, FaUpload } from "react-icons/fa";
import "../styles/ThumbnailUpload.scss";

const ThumbnailUpload = ({ thumbnail, setThumbnail, setGoBackText }) => {
  useEffect(() => {
    return () => {
      if (thumbnail && thumbnail.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [thumbnail]);

  const handleUpload = (e) => {
    const newThumbnail = URL.createObjectURL(e.target.files[0]);
    setThumbnail(newThumbnail);
    setGoBackText && setGoBackText("Go Back (Discard Changes)");
  };

  return (
    <>
      <label className="flex items-center justify-center editLabel">
        Thumbnail preview
        <FaImage className="m-1" />
      </label>
      <img src={thumbnail} className="thumbnailPreview" />
      <div className="flex items-center gap-2">
        <label className="imgInput">
          <FaUpload className="m-1" /> Upload new thumbnail
          <input
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
