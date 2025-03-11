import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/contexts/UserProvider";
import { FaArrowLeft, FaImage, FaSave, FaTrash, FaUpload, FaVideo } from "react-icons/fa";
import "../styles/EditVideoPage.scss";

const EditVideoPage = () => {
  const [videoData, setVideoData] = useState({ title: "", description: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [goBackText, setGoBackText] = useState("Go Back");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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
    if (videoData.userId && user.id !== videoData.userId) {
      navigate(`/video/${id}`);
      return;
    }
    if (videoData.title) {
      document.title = `Edit ${videoData.title} | Omega Stream`;
    }


  }, [user, videoData, navigate, id]);

  useEffect(() => {
    if(videoData.thumbnailId){
      const setDefaultThumbnail = async () => {
        setThumbnail(`${BASE_URL}/api/Video/thumbnail/${videoData.thumbnailId}`)
      }
      setDefaultThumbnail();
    }
  }, [videoData])

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
    setGoBackText("Go Back (Discard Changes)")
  };

  useEffect(() => {
    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [thumbnail]);
  
  //TODO: for some reason the backend gets terminated due to some signalR errors, whenever the thumbnail gets changed
  const handleUpload = (e) => {
    const newThumbnail = URL.createObjectURL(e.target.files[0]);
    setThumbnail(newThumbnail);
    setGoBackText("Go Back (Discard Changes)");
  };

  return (
    <div className="editContainer">
      <button className="goBack" onClick={
        () => {navigate(`/video/${id}`)}
      }>
        <FaArrowLeft className="m-1"/>{goBackText} 
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
      
      <label className="flex items-center justify-center editLabel">Thumbnail preview<FaImage className="m-1"/></label>
      <img src={thumbnail} className="thumbnailPreview"/>
      <div className="flex items-center gap-2">
        <label className="imgInput">
          <FaUpload className="m-1"/> Upload new thumbnail 
          <input type="file" accept=".png,.jpg,.jpeg" className="mt-1" onChange={handleUpload}/>
        </label>
        
      </div>
      
      <button className="saveBtn">
        <FaSave className="m-1"/> Save changes
      </button>
      <button className="deleteBtn">
        <FaTrash className="m-1"/> Delete video
      </button>
    </div>
  );
};

export default EditVideoPage;