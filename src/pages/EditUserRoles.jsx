import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import loading from "../assets/loading.gif";
import "../styles/EditUserRoles.scss";

const EditUserRoles = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [roles, setRoles] = useState([]);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

  const AVAILABLE_ROLES = ["Verified", "Admin"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`api/user/${id}`);
        if (response.status === 200) {
          setUser(response.data);
        }

        const rolesResponse = await axios.get(`api/user/get-roles/${id}`, {
          withCredentials: true,
        });

        if (rolesResponse.status === 200) {
          setRoles(rolesResponse.data);
        }
      } catch (error) {
        console.error(error);
        navigate("/not-found");
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleRoleChange = (role) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const response = await axios.post(`api/Admin/update-roles/${id}`,
         roles,
         {withCredentials: true})
      if (response.status === 200) {
        alert("Roles updated successfully!");
      } else {
        alert("Failed to update roles.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating roles.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="role-edit-container">
      {user ? (
        <div className="user-role-editor">
          <Link to={`/profile/${user.id}`}>
            <img
              src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${user.avatar.path}.${user.avatar.extension}`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full"
              title={user.userName}
            />
            </Link>
          <div className='userDetailList'>
            <p><strong>Username:</strong><Link to={`/profile/${user.id}`} className='username-label'> {user.userName}</Link></p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Created At: </strong> {user.created}</p>
            <p><strong>Subscribers: </strong> {user.followersCount}</p>
          </div>


          <div className="role-toggle">
            <p><strong>Modify Roles:</strong></p>
            {AVAILABLE_ROLES.map((role) => (
              <label key={role} className="block">
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                />
                <span className="ml-2">{role}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={updating}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      ) : (
        <div>
          <img src={loading} alt="Loading..." />
        </div>
      )}
    </div>
  );
};

export default EditUserRoles;
