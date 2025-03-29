import React from "react";
import { Link } from "react-router-dom";
import notFound from "../assets/not_found.png";
import "../styles/NotFoundPage.scss";


const NotFoundPage = () => {
  return (
    <div className="not-found-container">
        <img src={notFound} alt="Not Found"/>
      <h1>Oops! Page Not Found</h1>
      <p>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button>
        <Link to="/">Return to Home</Link>
      </button>
    </div>
  );
};

export default NotFoundPage;
