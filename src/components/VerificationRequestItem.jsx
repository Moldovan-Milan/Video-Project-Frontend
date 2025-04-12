import React, { forwardRef } from 'react';
import VerificationRequestHandler from './VerificationRequestHandler';
import "../styles/VerificationRequestItem.scss";

const VerificationRequestItem = forwardRef(({ user, onRequestProcessed }, ref) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  return (
    <div ref={ref} className='verification-request-container'>
      <img src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${user.avatar.path}.${user.avatar.extension}`}
       style={{ borderRadius: 100, width: 112, height:112 }} />
      <VerificationRequestHandler user={user} onRequestProcessed={onRequestProcessed} />
    </div>
  );
});

export default VerificationRequestItem;
