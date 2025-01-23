import React from "react";
import "../components/VideoItem.scss";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaEye } from "react-icons/fa";

const VideoItem = ({ video }) => {
  const { id, title, duration, created, thumbnailId, user } = video;
  console.log(user);
  // const id = 0;
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <div className="video-item shadow-md rounded-lg overflow-hidden border-2">
        <Link to={`/video/${id}`}>
          <img
            src={`https://localhost:7124/api/Video/thumbnail/${thumbnailId}`}
            //src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            alt={id}
            className="w-full h-48 object-cover"
          ></img>
          {/* <div className="video-length">10</div> */}
          <div className="bg-black text-white text-xs px-1 py-0.5 rounded video-duration">
            {duration}
          </div>
          <div className="p-4 video-details">
          <table className={"vid-info-table"}>
            <tbody>
          <tr>
            <td rowSpan={2} className={"uploader-avt"}>
            <img
                src={`https://localhost:7124/api/User/avatar/${user.avatarId}`}
                // src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                className="w-10 h-10 rounded-full mr-2 "
              ></img>
            </td>
            <td>
            <div className="video-title font-bold">
              {title}
            </div>
            </td>
          </tr>
          <tr>
            <td> <div className="text-sm">
                {/* <div className="video-title">Teszt</div> */}
                
                <div className="video-info text-gray-600 uploader-name">Csóka Csaba</div>
              </div></td>
          </tr>
          </tbody>
        </table>
          
            
            <div className="flex items-center mb-2">
              
             
            </div>
            <div className="text-gray-600 text-xs views">
              <FaEye className="eye-icon"/>10 views ● Created: {timeAgo(new Date(created))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VideoItem;
