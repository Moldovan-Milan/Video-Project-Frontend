import React, { useEffect, useState } from 'react'
import axios from "axios"
import { FaSearch, FaIdBadge } from "react-icons/fa"
import UserItem from '../components/UserItem'
import "../styles/UserRoleEditPage.scss"

const UserRoleEditPage = () => {
  const [users, setUsers] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 30

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `api/user?pageSize=${pageSize}&pageNumber=${pageNumber}`
        )
        const { users, hasMore } = response.data

        setUsers((prevUsers) => {
          const filteredUsers = users.filter(
            (newUser) => !prevUsers.some((user) => user.id === newUser.id)
          )
          return [...prevUsers, ...filteredUsers]
        })

        setHasMore(hasMore)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    getUsers()
  }, [pageNumber])

  return (
    <div className="p-4 flex flex-col gap-6 max-w-md mx-auto">
    {/* Search Section */}
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
        {/* Search by Name */}
        <div className="w-full md:w-80">
        <label className="block text-sm font-semibold mb-1">Search by Name</label>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 dark:border-gray-600">
            <FaSearch className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
            type="text"
            placeholder="Enter username"
            className="w-full bg-transparent outline-none text-sm"
            />
        </div>
        </div>

        {/* Search by ID */}
        <div className="w-full md:w-80">
        <label className="block text-sm font-semibold mb-1">Search by User ID</label>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 dark:border-gray-600">
            <FaIdBadge className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
            type="text"
            placeholder="Enter user ID"
            className="w-full bg-transparent outline-none text-sm"
            />
        </div>
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
            <button
                className="hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2 text-sm transition-colors duration-200 w-full md:w-auto search-button"
            >
                Search
            </button>
        </div>
    </div>

    {/* User List Section */}
    <div className="user-list-container">
        {users.map((user) => (
        <UserItem key={user.id} user={user} />
        ))}
    </div>
    </div>

  )
}

export default UserRoleEditPage
