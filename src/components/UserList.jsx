import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import "../styles/UserList.scss"
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
              <li key={connectedUser.id} className="w2gConnItem">
                <div className="w2g-conn-user-info">
                {console.log(connectedUser)}
                <img
                  src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${connectedUser.avatar.path}.${connectedUser.avatar.extension}`}
                  alt={connectedUser.username}
                  className="w2gConnAvt"
                />
                <span className="w2gConnName">{connectedUser.userName}</span>
                {isHost && connectedUser.id !== user.id && (
                  <button
                    onClick={() => banUser(connectedUser.id)}
                    className="w2gBanBtn"
                  >
                    Ban user
                  </button>
                )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
