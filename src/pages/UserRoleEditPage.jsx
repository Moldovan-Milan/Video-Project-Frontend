import React, { useEffect, useState } from 'react'
import axios from "axios"

const UserRoleEditPage = () => {
  const[pageNumber, setPageNumber] = useState(1)
  const pageSize = 30
  useEffect(() => {
    const getUsers = async () => {
        try {
            const response = await axios.get(
              `api/user?pageSize=${pageSize}&pageNumber=${pageNumber}`
            );
            const { users, hasMore } = response.data;
    
            setVideos((prevUsers) => {
                const filteredUsers = users.filter(
                    (newUser) => !prevUsers.some((user) => user.id === newUser.id)
                );
                return [...prevUsers, ...filteredUsers];
            });
            setHasMore(hasMore);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
    }
  }, [pageNumber])

  return (
    <div>UserRoleEditPage</div>
  )
}

export default UserRoleEditPage
