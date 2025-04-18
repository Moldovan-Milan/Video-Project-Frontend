import React, { useContext, useRef, useState } from "react";
import "../styles/CommentTextBox.scss";
import { UserContext } from "./contexts/UserProvider";
import axios from "axios";
import dummy from "../assets/defa_pfp.png";

const CommentTextBox = ({ videoid, setComments }) => {
  const textAreaRef = useRef();
  const [error, setError] = useState();
  const user = useContext(UserContext);

  const uploadComment = async (content, formData) => {
    const result = await axios.post("/api/video/write-new-comment", formData, 
      {
        withCredentials: true
      },
    );
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
      textAreaRef.current.value = "";
    }
  };

  const handleCommentSendClick = () => {
    const content = textAreaRef.current.value;
    if (!user) {
      setError("Log in to write a comment!");
      return;
    }
    if (!content || !videoid) {
      setError("You can't send an empty comment!");
      return;
    }
    const formData = new FormData();
    formData.append("Content", content);
    formData.append("VideoId", videoid);
    uploadComment(content, formData);
  };

  return (
    <div className="SubmitCommMain">
      <div className="SubmitCommCol1">
        <img src={dummy} className="CommentWriterAvt" />
      </div>
      <div className="SubmitCommCol2">
      <textarea
                ref={textAreaRef}
                className="CommTextarea"
                placeholder="Write a comment... ✏"
              ></textarea>
              <span>{error}</span>
      </div>
      <div className="SubmitCommCol3">
      <button
                onClick={() => handleCommentSendClick()}
                className="BtnAddComm font-bold py-2 px-4 mb-2 navbar-btn m-1 text-white"
              >
                Send
              </button>
      </div>
    </div>
  );
};

export default CommentTextBox;
