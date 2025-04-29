import "../styles/ChatUserItem.scss";
import { Link } from "react-router-dom";

export default function ChatUserItem({ chat }) {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
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
                    src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${chat.user.avatar.path}.${chat.user.avatar.extension}`}
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
