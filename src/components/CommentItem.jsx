import { FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import "./CommentItem.scss"
export default function CommentItem({comment}){
    return(<table className="comment-item-body">
        <tbody>
            <tr className="comment-row">
                <td rowSpan={3} className="comment-col avatar-col">
                    <img src={comment.user.avatar} className="comment-avatar"></img>
                </td>
                <td className="comment-col">
                    <span><span className="commenter-name">{comment.user.name}</span> - {comment.created}</span>
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
    </table>)
}