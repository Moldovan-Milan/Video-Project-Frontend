import { FaEye, FaSave, FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import "../styles/CommentItem.scss";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import { FaPencil, FaX } from "react-icons/fa6";
import { useContext, useState } from "react";
import { UserContext } from "./contexts/UserProvider";
import axios from "axios";

export default function CommentItem({ comment }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const {user} = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState("");

  const handleCommentEdit = () => {
    setIsEditing(true)
    setEditedComment(comment.content)
  }

  const handleDiscardEdit = () => {
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment?"
      )
    ) {
      try{
        const response = await axios.delete(`api/Video/delete-comment/${comment.id}`, {
          withCredentials: true,
        });
        if (response.status === 204) {
          window.alert("Your comment has been succesfully deleted!")
          location.reload();
        }
      }
      catch(error){
        console.error(error);
      }
    }
  } 

  const handleSave = () => {
    const safeComment = editedComment
    const saveChanges = async () =>{
      try{
        if(safeComment === comment.content){
          setIsEditing(false)
          return
        }
        const response = await axios.patch(`api/Video/edit-comment/${comment.id}`,
          safeComment,
          {
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          }
        )
        if(response.status === 204){
          window.alert("Successfully saved comment!")
          comment.content = safeComment
          setIsEditing(false)
        }
      }
      catch(error){
        console.error(error)
      }
    }
    saveChanges();
  }

  return (
    <table className="comment-item-body">
      <tbody>
        <tr className="comment-row">
          <td rowSpan={3} className="comment-col avatar-col">
            <Link to={`/profile/${comment.user.id}`}>
              <img
                src={`${BASE_URL}/api/user/avatar/${comment.user.avatarId}`}
                className="comment-avatar"
              ></img>
            </Link>
          </td>
          <td className="comment-col">
            <span>
              <Link to={`/profile/${comment.user.id}`}>
                <span className="commenter-name">{comment.user.userName}</span>{" "}
                -{" "}
              </Link>
              {timeAgo(new Date(comment.created))}
            </span>
          </td>
        </tr>
        <tr className="comment-row">
          <td className="comment-col">
            {!isEditing ? (
            <div className="content-container">
              <p className="comment-content">{comment.content}</p>
                {user && user.id === comment.user.id && 
                  <div className="button-container">
                    <button className="edit-button" onClick={handleCommentEdit}><FaPencil className="m-1"/></button>
                    <button className="delete-button" onClick={handleDelete}><FaTrash className="m-1"/>Delete</button>
                  </div>}
            </div>):(
              <div>
                  <textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} className="comment-edit"/>
                  <button className="save-button" onClick={handleSave}><FaSave className="m-1"/>Save Comment</button>
                  <button className="discard-button" onClick={handleDiscardEdit}><FaX className="m-1"/>Discard Changes</button>
              </div>
            )}
            
          </td>
        </tr>
        <tr className="comment-row">
          <td className="comment-col">
            <div className="comment-likes">
              <button className="likes" id="like-button">
                <FaThumbsUp
                  //style={likeValue === "like" && { color: "rgb(26, 165, 26)" }}
                  //onClick={handleLikeClick}
                  className="symbol"
                />
                {/* {videoData.likes} */}
              </button>
              <button className="likes" id="dislike-button">
                <FaThumbsDown
                  //style={likeValue === "dislike" && { color: "red" }}
                  //onClick={handleDislikeClick}
                  className="symbol"
                />
                {/* {videoData.dislikes} */}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
