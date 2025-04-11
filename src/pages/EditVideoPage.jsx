import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/contexts/UserProvider";
import {
  FaArrowLeft,
  FaImage,
  FaSave,
  FaTrash,
  FaUpload,
  FaVideo,
} from "react-icons/fa";
import "../styles/EditVideoPage.scss";
import getRoles from "../functions/getRoles";
import ThumbnailUpload from "../components/ThumbnailUpload";

const EditVideoPage = () => {
  const [videoData, setVideoData] = useState({ title: "", description: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [goBackText, setGoBackText] = useState("Go Back");
  const { id } = useParams();
  const [safeId] = useState(id);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [roles, setRoles] = useState([])

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
    const fetchData = async () => {
      try {
        const videoResponse = await axios.get(`/api/video/data/${id}`);
        setVideoData(videoResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (videoData.userId && (user.id !== videoData.userId && !roles.includes("Admin"))) {
      navigate(`/video/${id}`);
      return;
    }
    if (videoData.title) {
      document.title = `Edit ${videoData.title} | Omega Stream`;
    }
  }, [user, videoData, navigate, id]);

  useEffect(() => {
    if (videoData.thumbnailId) {
      const setDefaultThumbnail = async () => {
        setThumbnail(
          `${BASE_URL}/api/Video/thumbnail/${videoData.thumbnailId}`
        );
      };
      setDefaultThumbnail();
    }
  }, [videoData]);

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
    setGoBackText("Go Back (Discard Changes)");
  };

  useEffect(() => {
    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [thumbnail]);

  const handleUpload = (e) => {
    const newThumbnail = URL.createObjectURL(e.target.files[0]);
    setThumbnail(newThumbnail);
    setGoBackText("Go Back (Discard Changes)");
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this video? This action is irreversible, and the video cannot be recovered."
      )
    ) {
      const response = await axios.delete(`api/Video/delete/${safeId}`, {
        withCredentials: true,
      });
      if (response.status === 204) {
        navigate(`/profile/${user.id}`);
      }
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      if (videoData.title) {
        formData.append("title", videoData.title);
      }
      if (videoData.description) {
        formData.append("description", videoData.description);
      }
      if (thumbnail && thumbnail.startsWith("blob:")) {
        const fileInput = document.querySelector("input[type='file']");
        if (fileInput.files.length > 0) {
          formData.append("image", fileInput.files[0]);
        }
      }

      const response = await axios.patch(
        `${BASE_URL}/api/video/update/${safeId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 204) {
        navigate(`/video/${safeId}`);
      }
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video. Please try again.");
    }
  };

  return (
    <div className="editContainer">
      <button
        className="goBack"
        onClick={() => {
          navigate(`/video/${id}`);
        }}
      >
        <FaArrowLeft className="m-1" />
        {goBackText}
      </button>
      <h1 className="text-2xl font-bold mb-4 flex items-center editTitle">
        <FaVideo className="mr-2 text-blue-500" /> Edit Your Video
      </h1>
      <label className="editLabel">Title</label>
      <input
        type="text"
        name="title"
        value={videoData.title}
        onChange={handleChange}
        className="titleInput"
      />

      <label>Description</label>
      <textarea
        type="text"
        name="description"
        value={videoData.description}
        onChange={handleChange}
        className="descriptionTextArea"
      />

      <ThumbnailUpload
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        setGoBackText={setGoBackText}
      />


      <button className="saveBtn" onClick={handleSave}>
        <FaSave className="m-1" /> Save changes
      </button>
      <button className="deleteBtn" onClick={handleDelete}>
        <FaTrash className="m-1" /> Delete video
      </button>
    </div>
  );
};

export default EditVideoPage;
