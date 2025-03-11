import React, { useState } from "react";

const UserList = ({ users, isHost, user, banUser }) => {
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div>
      <button
        className="wt-toggle-users-btn"
        onClick={() => setShowUsers(!showUsers)}
      >
        {showUsers ? "Hide Users" : "Show Users"}
      </button>

      {showUsers && (
        <div className="wt-user-list">
          <h4>Connected Users</h4>
          <ul>
            {users.map((connectedUser) => (
              <li key={connectedUser.id}>
                <img
                  src={`https://localhost:7124/api/User/avatar/${connectedUser.avatarId}`}
                  alt={connectedUser.username}
                />
                <span>{connectedUser.userName}</span>
                {isHost && connectedUser.id !== user.id && (
                  <button
                    onClick={() => banUser(connectedUser.id)}
                    className="wt-bg-red-500 wt-text-black wt-hover:bg-red-600"
                  >
                    Ban user
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
