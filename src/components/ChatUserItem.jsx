import "../styles/ChatUserItem.scss";
import { Link } from "react-router-dom";

export default function ChatUserItem({ chat }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div className="chatUserItemContainer" title={chat.user.userName}>
      <div className="chatUserItem">
        <Link to={`/chat/${chat.id}?name=${chat.user.userName}`}>
          <table className="chatUserItemTable">
            <tbody>
              <tr>
                <td className="chatAvatartd">
                  <img
                    className="chatUserItemAvatar"
                    src={`${BASE_URL}/api/User/avatar/${chat.user.avatarId}`}
                  ></img>
                </td>
                <td className="chatUserItemDetails">
                  <div className="chatUserItemTitle">{chat.user.userName}</div>
                  <div className="chatUserItemUploader">
                    {chat.lastMessage
                      ? "Last message: " + chat.lastMessage
                      : chat.lastMessage}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Link>
      </div>
    </div>
  );
}
