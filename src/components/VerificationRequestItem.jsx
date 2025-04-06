import React, { forwardRef } from 'react';
import VerificationRequestHandler from './VerificationRequestHandler';
import "../styles/VerificationRequestItem.scss";

const VerificationRequestItem = forwardRef(({ user, onRequestProcessed }, ref) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div ref={ref} className='verification-request-container'>
      <img src={`${BASE_URL}/api/User/avatar/${user.avatarId}`} style={{ borderRadius: 100 }} />
      <VerificationRequestHandler user={user} onRequestProcessed={onRequestProcessed} />
    </div>
  );
});

export default VerificationRequestItem;
