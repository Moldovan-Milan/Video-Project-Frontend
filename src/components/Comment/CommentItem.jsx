import { FaSave, FaTrash } from "react-icons/fa";
import "../../styles/Comment/CommentItem.scss";
import { Link } from "react-router-dom";
import timeAgo from "../../functions/timeAgo";
import { FaPencil, FaX } from "react-icons/fa6";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserProvider";
import axios from "axios";
import getRoles from "../../functions/getRoles";

export default function CommentItem({ comment }) {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadRoles = async () => {
      const fetchedRoles = await getRoles(user.id);
      setRoles(fetchedRoles);
    };

    if (user) {
      loadRoles();
    }
  }, [user]);

  const handleCommentEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.content);
  };

  const handleDiscardEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await axios.delete(
          `api/Video/delete-comment/${comment.id}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 204) {
          window.alert("Your comment has been succesfully deleted!");
          location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = () => {
    const safeComment = editedComment;
    const saveChanges = async () => {
      try {
        if (safeComment === comment.content) {
          setIsEditing(false);
          return;
        }
        const response = await axios.patch(
          `api/Video/edit-comment/${comment.id}`,
          safeComment,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.status === 204) {
          window.alert("Successfully saved comment!");
          comment.content = safeComment;
          setIsEditing(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    saveChanges();
  };

  return (
    <table className="comment-item-body">
      <tbody>
        <tr className="comment-row">
          <td rowSpan={3} className="comment-col avatar-col">
            <Link to={`/profile/${comment.user.id}`}>
              <img
                src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${comment.user.avatar.path}.${comment.user.avatar.extension}`}
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
                {user &&
                  (user.id === comment.user.id || roles.includes("Admin")) && (
                    <div className="button-container">
                      <button
                        className="edit-button"
                        onClick={handleCommentEdit}
                      >
                        <FaPencil className="m-1" />
                      </button>
                      <button className="delete-button" onClick={handleDelete}>
                        <FaTrash className="m-1" />
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <div>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="comment-edit"
                />
                <button className="save-button" onClick={handleSave}>
                  <FaSave className="m-1" />
                  Save Comment
                </button>
                <button className="discard-button" onClick={handleDiscardEdit}>
                  <FaX className="m-1" />
                  Discard Changes
                </button>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
