import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import loading from "../assets/loading.gif";

const EditUserRoles = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [roles, setRoles] = useState([]);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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
          <img
            src={`${BASE_URL}/api/User/avatar/${user.avatarId}`}
            alt="User Avatar"
            className="w-24 h-24 rounded-full"
          />
          <p><strong>Username:</strong> {user.userName}</p>
          <p><strong>ID:</strong> {user.id}</p>

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
