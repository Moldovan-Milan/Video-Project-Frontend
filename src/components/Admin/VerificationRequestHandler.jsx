import React from 'react'
import "../../styles/Admin/VerificationRequestHandler.scss"
import axios from "axios"
import { FaCheck } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const VerificationRequestHandler = ({ user, onRequestProcessed }) => {
    const handleAccept = async () => {
      try {
        const response = await axios.post(
          `api/Admin/verify-user/${user.id}`,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          window.alert("Successfully verified user!");
          onRequestProcessed(user.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDecline = async () => {
      try {
        const response = await axios.post(
          `api/Admin/decline-verification/${user.id}`,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          window.alert("Successfully declined verification!");
          onRequestProcessed(user.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className="verification-container">
        <p className="request-text">
          <span className='username-label' title={user.userName}>
            <Link to={`/profile/${user.id}`}>
              {user.userName + " "}
            </Link>
          </span>
        Would like to get Verified</p>
        <button className="accept-button" onClick={handleAccept}><FaCheck className='m-1'/> Accept</button>
        <button className="decline-button" onClick={handleDecline}><FaX className='m-1'/> Decline</button>
      </div>
    );
  };
  
  export default VerificationRequestHandler;
  