import React, { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useVideoUpload } from "../hooks/useVideoUpload";
import "../styles/UploadVideo.scss";
import { useContext } from "react";
import { UserContext } from "../components/contexts/UserProvider";
import { Link } from "react-router-dom";
import getRoles from "../functions/getRoles";
import VerificationRequestButton from "../components/VerificationRequestButton";
import getActiveVerificationRequestStatus from "../functions/getActiveVerificationRequestStatus";
import { FaShieldAlt } from "react-icons/fa";
import axios from "axios";
import ThumbnailUpload from "../components/ThumbnailUpload";

const UploadVideo = () => {
  const {
    file,
    image,
    setFile,
    setImage,
    titleRef,
    descriptionRef,
    error,
    isUploaded,
    uploading,
    uploadPercent,
    handleUpload,
  } = useVideoUpload();

  const { user } = useContext(UserContext);
  const [roles, setRoles] = useState([]);
  const [hasActiveRequest, setHasActiveRequest] = useState(null);
  const [supportedFormats, setSupportedFormats] = useState([]);

  useEffect(() => {
    document.title = "Upload video | Omega Stream";
  }, []);

  useEffect(() => {
    const loadRoles = async () => {
      const fetchedRoles = await getRoles(user.id);
      setRoles(fetchedRoles);
    };

    if (user) {
      loadRoles();
    }
  }, [user]);

  useEffect(() => {
    const checkVerificationRequest = async () => {
      const hasRequest = await getActiveVerificationRequestStatus(user.id);
      setHasActiveRequest(hasRequest);
    };
    checkVerificationRequest();
  }, []);

  useEffect(() => {
    const loadSupportedFormats = async () => {
      try {
        const response = await axios.get("api/video/get-supported-formats");
        if (response.status === 200) {
          const formats = response.data;
  
          const acceptString = formats.join(",");
  
          setSupportedFormats(acceptString);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    loadSupportedFormats();
  }, []);

  const handleVerificationRequest = () => {
    setHasActiveRequest(true);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-4">
          You Are not Logged In!
        </h1>
        <p className="text-center mb-4">To Upload Videos you need to Log In</p>
        <Link
          to="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 block text-center"
        >
          Log In
        </Link>
      </div>
    );
  } else if (!roles.includes("Verified") && !roles.includes("Admin")) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4 rounded-md">
        <div
          className="shadow-xl rounded-2xl p-8 max-w-md w-full text-center border"
          style={{ backgroundColor: "darkcyan", borderRadius: "10px" }}
        >
          <div className="flex justify-center mb-4 text-4xl">
            <FaShieldAlt />
          </div>
          <h1 className="text-2xl font-extrabold">You Are Not Verified</h1>
          <p className="mb-4">
            To upload videos, you need to be verified first.
          </p>

          {hasActiveRequest !== null && (
            <>
              {hasActiveRequest ? (
                <p className="font-medium">
                  Your verification request has been sent! <br /> Please wait
                  until it’s reviewed.
                </p>
              ) : (
                <div className="mt-4">
                  <VerificationRequestButton
                    onRequestSent={handleVerificationRequest}
                  />
                </div>
              )}
            </>
          )}
        </div>
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
            accept={supportedFormats}
            hidden
          />
        <label htmlFor="uploadVideo" className="uploadBtn">
          <FaUpload className="upload-icn" /> Choose a video
        </label>
        {file && (
          <div className="mt-4">
            <p className="mt-2 text-sm text-center m-3">
              Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <video
              src={URL.createObjectURL(file)}
              controls
              width="320"
              height="180"
              className="rounded-md shadow-md"
              style={{margin: "auto", maxHeight: 180, maxWidth: 320}} 
            />
          </div>
        )}


      </div>
      <div className="mb-4">
        <ThumbnailUpload 
          thumbnail={image}
          setThumbnail={setImage}
          maxWidth={480}
          maxHeight={270}
          buttonText={"Upload Thumbnail"}/>
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="block font-bold mb-2 uploadLabel">
          Title
        </label>
        <input
          className="form-input text-black px-4 py-2 inputTitle"
          name="title"
          type="text"
          ref={titleRef}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block font-bold mb-2 uploadLabel">
          Description
        </label>
        <textarea
          className="form-input text-white px-4 py-2 inputDescription"
          name="description"
          ref={descriptionRef}
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
