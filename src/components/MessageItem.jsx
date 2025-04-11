import timeAgo from "../functions/timeAgo";
import "../styles/MessageItem.scss";

export default function MessageItem({ msg, user }) {
  return (
    <div
      className={msg.senderId === user.id ? "message sent" : "message received"}
    >
      <div className="message-content">{msg.content}</div>
      <div className="message-info">Sent {timeAgo(new Date(msg.sentAt))}</div>
    </div>
  );
}
