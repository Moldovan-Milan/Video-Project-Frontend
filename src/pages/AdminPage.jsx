import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import "../styles/Admin/AdminPage.scss";
import { FaCheckCircle, FaUserCog, FaUserTie } from "react-icons/fa";

const AdminPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("api/Admin/admin-test", {
          withCredentials: true,
        });
      } catch (e) {
        console.error(e);
        navigate("/not-found");
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <div className="admin-navbar">
        <h1>
          Admin Page <FaUserTie className="m-3" />
        </h1>
        <div className="admin-link-list">
          <Link to={"/admin/verification-list"}>
            <button>
              Verification Requests <FaCheckCircle className="m-1" />
            </button>
          </Link>
          <Link to={"/admin/edit-user-roles"}>
            <button>
              Edit User Roles <FaUserCog className="m-1" />
            </button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminPage;
