import React from "react";
import "../../styles/WatchTogether/JoinRequests.scss"
const JoinRequests = ({ isHost, userRequest, acceptUser, rejectUser }) => {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  return (
    isHost &&
    userRequest.length > 0 && (
      <div className="wt-join-requests">
        <h4>Join Requests</h4>
        <ul>
          {userRequest.map((requestUser) => (
            <li key={requestUser.id}>
              <div>
                <img
                  src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${requestUser.avatar.path}.${requestUser.avatar.extension}`}
                  alt={requestUser.userName}
                />
                <p>{requestUser.userName}</p>
              </div>
              <div className="wt-action-buttons">
                <button
                  className="wt-accept"
                  onClick={() => acceptUser(requestUser.id)}
                >
                  Accept
                </button>
                <button
                  className="wt-reject"
                  onClick={() => rejectUser(requestUser.id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default JoinRequests;
