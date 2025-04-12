import React from 'react'
import "../styles/UserItem.scss"

const UserItem = ({user}) => {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  return (
    <div className='user-item-container' title={user.userName}>
        <img src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${user.avatar.path}.${user.avatar.extension}`}/>
        <p>{user.userName}</p>
    </div>
  )
}

export default UserItem