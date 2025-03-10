import React from "react";

const JoinRequests = ({ isHost, userRequest, acceptUser, rejectUser }) => {
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
                  src={`https://localhost:7124/api/User/avatar/${requestUser.avatarId}`}
                  alt={requestUser.userName}
                />
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
