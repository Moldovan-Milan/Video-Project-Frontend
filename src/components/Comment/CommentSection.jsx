import React from "react";
import CommentItem from "./CommentItem";
import CommentTextBox from "./CommentTextBox";
import "../../styles/Comment/CommentSection.scss";
export default function CommentSection({ videoId, comments, setComments }) {
  return (
    <div>
      <CommentTextBox videoid={videoId} setComments={setComments} />
      {comments &&
      <>
      <p className="CommentsCount">{comments.length} comments</p>
      {comments.map((comment, id) => (
          <CommentItem key={id} comment={comment} />
        ))}
      </>
        }
    </div>
  );
}
