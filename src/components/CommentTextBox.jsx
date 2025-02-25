import React, { useContext, useRef, useState } from "react";
import "../styles/CommentTextBox.scss";
import { UserContext } from "./contexts/UserProvider";
import axios from "axios";
import dummy from "../assets/defa_pfp.png";

const CommentTextBox = ({ videoid, setComments }) => {
  const textAreaRef = useRef();
  const [error, setError] = useState();
  const user = useContext(UserContext);

  const uploadComment = async (content, formData, token) => {
    const result = await axios.post("/api/video/write-new-comment", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (result.status !== 200) {
      setError(result.statusText);
    } else {
      setError(null);
      const newComment = {
        id: result.data,
        content: content,
        created: new Date(),
        user: { userName: user.userName, avatarId: user.avatarId },
      };
      setComments((prevComments) => [...prevComments, newComment]);
      textAreaRef.current.value = ""; // Szövegmező ürítése
    }
  };

  const handleCommentSendClick = () => {
    const content = textAreaRef.current.value;
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      setError("Komment írásához jelentkezz be!");
      return;
    }
    if (!content || !videoid) {
      setError("Nem lehet üres kommentet küldeni!");
      return;
    }
    const formData = new FormData();
    formData.append("Content", content);
    formData.append("VideoId", videoid);
    uploadComment(content, formData, token);
  };

  return (
    <div className="comm-tb-cont">
      <table className="comment-table">
        <tbody>
          <tr>
            <td className="avatar-td">
              <img src={dummy} className="comment-write-avatar" />
            </td>
            <td className="td-comm-tb">
              <textarea
                ref={textAreaRef}
                className="tb-comm"
                placeholder="Write a comment... ✏"
              ></textarea>
              <span>{error}</span>
            </td>
            <td className="btn-td">
              <button
                onClick={() => handleCommentSendClick()}
                className="btn-send"
              >
                Send
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CommentTextBox;
