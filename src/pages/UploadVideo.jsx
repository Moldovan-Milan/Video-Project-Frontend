import React from "react";
import { FaUpload } from "react-icons/fa";
import { useVideoUpload } from "../hooks/useVideoUpload";
import "../styles/UploadVideo.scss";

const UploadVideo = () => {
  const {
    file,
    image,
    setFile,
    setImage,
    titleRef,
    error,
    isUploaded,
    uploading,
    uploadPercent,
    handleUpload,
  } = useVideoUpload();

  if (sessionStorage.getItem("jwtToken") === null) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Nem vagy bejelentkezve!
        </h1>
        <p className="text-center mb-4">A feltöltéshez be kell jelentkezned.</p>
        <a
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 block text-center"
        >
          Bejelentkezés
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4 uplTitle">
        Upload a video
      </h1>
      <div className="mb-4">
        <label htmlFor="video" className="block font-bold mb-2 uploadLabel">
          Video
        </label>
        <input
          id="uploadVideo"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="video/*"
          hidden
        />
        <label htmlFor="uploadVideo" className="uploadBtn">
          <FaUpload className="upload-icn" /> Choose a video
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="thumbnail" className="block font-bold mb-2 uploadLabel">
          Thumbnail
        </label>
        <input
          id="uploadThumbnail"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept=".png"
          hidden
        />
        <label htmlFor="uploadThumbnail" className="uploadBtn">
          <FaUpload className="upload-icn" /> Choose a thumbnail
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block font-bold mb-2 uploadLabel">
          Title
        </label>
        <input
          className="form-input text-black w-full px-4 py-2 inputTitle"
          name="title"
          type="text"
          ref={titleRef}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!uploading && !isUploaded && (
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 m-auto sendVid"
        >
          Upload
        </button>
      )}
      {isUploaded && (
        <h1 className="text-green-500 text-center mt-4">
          Video successfully uploaded!
        </h1>
      )}
      {uploading && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          type="button"
          disabled
        >
          <svg
            className="animate-spin mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Uploading {uploadPercent} %
        </button>
      )}
    </div>
  );
};

export default UploadVideo;
