import "../styles/ChatUserItem.scss";
import { Link } from "react-router-dom";

export default function ChatUserItem({chat})
{

return(
    <div className="chatUserItemContainer" title={chat.user.userName}>
    <div className="chatUserItem">
        {console.log(chat)}
    <Link to={`/chat/${chat.id}?name=${chat.user.userName}`}>
        <table className="chatUserItemTable">
        <tbody>
            <tr>
            <td className="chatAvatartd">
            <img className="chatUserItemAvatar" src={`https://localhost:7124/api/User/avatar/${chat.user.avatarId}`}></img>
            </td>
            <td className="chatUserItemDetails">
                <div className="chatUserItemTitle">
                {chat.user.userName}
                </div>
                <div className="chatUserItemUploader">{chat.lastMessage? "Last message: "+chat.lastMessage:chat.lastMessage}</div>
            </td>
            </tr>
        </tbody>
        </table>
    </Link>
    </div>
    </div>

)
}