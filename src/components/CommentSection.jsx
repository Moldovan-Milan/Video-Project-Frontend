import React from "react";
import CommentItem from "./CommentItem";
import CommentTextBox from "./CommentTextBox";

export default function CommentSection({ videoId, comments, setComments }) {
  return (
    <div>
      <CommentTextBox videoid={videoId} setComments={setComments} />
      {comments &&
        comments.map((comment, id) => (
          <CommentItem key={id} comment={comment} />
        ))}
    </div>
  );
}
