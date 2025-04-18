import React, { useState } from "react";
import { FaUser } from "react-icons/fa";

const UserList = ({ users, isHost, user, banUser }) => {
  const [showUsers, setShowUsers] = useState(false);
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  return (
    <div>
      <button
        className="W2GUserToggler"
        onClick={() => setShowUsers(!showUsers)}
      >
        {showUsers ? (
          `Hide Users`
        ) : (
          <p className="flex">
            <FaUser className="m-1" /> Show the users in the room
          </p>
        )}
      </button>

      {showUsers && (
        <div className="wt-user-list">
          <h4 className="W2GConnUsers">Connected Users</h4>
          <ul>
            {users.map((connectedUser) => (
              <li key={connectedUser.id}>
                {console.log(connectedUser)}
                <img
                  src={`https://localhost:7124/api/User/avatar/${connectedUser.avatarId}`}
                  // TODO: Replace src with this
                  //src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${connectedUser.avatar.path}.${connectedUser.avatar.extension}`}
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
