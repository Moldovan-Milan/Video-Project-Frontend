import { FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import "./CommentItem.scss";
import timeAgo from "../functions/timeAgo";
export default function CommentItem({ comment }) {
  console.log(comment);
  return (
    <table className="comment-item-body">
      <tbody>
        <tr className="comment-row">
          <td rowSpan={3} className="comment-col avatar-col">
            <img
              src={`https://localhost:7124/api/user/avatar/${comment.user.avatarId}`}
              className="comment-avatar"
            ></img>
          </td>
          <td className="comment-col">
            <span>
              <span className="commenter-name">{comment.user.userName}</span> -{" "}
              {timeAgo(new Date(comment.created))}
            </span>
          </td>
        </tr>
        <tr className="comment-row">
          <td className="comment-col">
            <p className="comment-content">{comment.content}</p>
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
