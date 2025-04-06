import React from 'react'
import "../styles/UserItem.scss"

const UserItem = ({user}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div className='user-item-container'>
        <img src={`${BASE_URL}/api/User/avatar/${user.avatarId}`}/>
        <p>{user.userName}</p>
    </div>
  )
}

export default UserItem