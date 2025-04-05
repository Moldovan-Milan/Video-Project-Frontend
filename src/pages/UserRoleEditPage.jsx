import React, { useEffect, useState, useRef, useCallback } from 'react'
import axios from "axios"
import { FaIdBadge, FaSearch } from "react-icons/fa"
import UserItem from '../components/UserItem'
import "../styles/UserRoleEditPage.scss"

const pageSize = 30
const DEBOUNCE_DELAY = 250

const UserRoleEditPage = () => {
  const [users, setUsers] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)

  const [userId, setUserId] = useState("")
  const [username, setUsername] = useState("")

  const [debouncedUserId, setDebouncedUserId] = useState("")
  const [debouncedUsername, setDebouncedUsername] = useState("")

  const [error, setError] = useState("")
  const observer = useRef(null)
  const debounceTimeout = useRef(null)

  const handleInputChange = (type, value) => {
    if (type === 'id') {
      setUserId(value)
    } else {
      setUsername(value)
    }
  
    setError("")
    setPageNumber(1)
    setUsers([])
    setHasMore(true)
  
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
  
    debounceTimeout.current = setTimeout(() => {
      setDebouncedUserId(type === 'id' ? value.trim() : userId.trim())
      setDebouncedUsername(type === 'username' ? value.trim() : username.trim())
    }, DEBOUNCE_DELAY)
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("")

        if (debouncedUserId !== "") {
          const response = await axios.get(`/api/user/${debouncedUserId}`)
          setUsers([response.data])
          setHasMore(false)
        } else if (debouncedUsername !== "") {
          const response = await axios.get(`/api/user/search/${debouncedUsername}?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          const { users: foundUsers, hasMore } = response.data
        
          if (pageNumber === 1 && foundUsers.length === 0) {
            setError("No users found with that username.")
            setUsers([])
            setHasMore(false)
            return
          }
        
          setUsers((prev) => {
            const filtered = foundUsers.filter(u => !prev.some(existing => existing.id === u.id))
            return [...prev, ...filtered]
          })
          setHasMore(hasMore)
        }
         else {
          const response = await axios.get(`/api/user?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          const { users: newUsers, hasMore } = response.data
          setUsers((prev) => {
            const filtered = newUsers.filter(u => !prev.some(existing => existing.id === u.id))
            return [...prev, ...filtered]
          })
          setHasMore(hasMore)
        }
      } catch (error) {
        setUsers([])
        setHasMore(false)
        if (error.response?.status === 404) {
          setError("User not found.")
        } else {
          setError("An error occurred while fetching users.")
        }
      }
    }

    fetchData()
  }, [pageNumber, debouncedUserId, debouncedUsername])

  const lastUserRef = useCallback(
    (node) => {
      if (debouncedUserId || debouncedUsername) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [hasMore, debouncedUserId, debouncedUsername]
  )

  return (
    <div className="p-4 flex flex-col gap-6 max-w-md mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
        <div className="w-full md:w-80">
          <label className="block text-sm font-semibold mb-1">Search by Username</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 dark:border-gray-600">
            <FaSearch className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter username"
              className="w-full bg-transparent outline-none text-sm"
              value={username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-80">
          <label className="block text-sm font-semibold mb-1">Search by User ID</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 dark:border-gray-600">
            <FaIdBadge className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter user ID"
              className="w-full bg-transparent outline-none text-sm"
              value={userId}
              onChange={(e) => handleInputChange("id", e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm font-medium text-center">{error}</p>
      )}

      <div className="user-list-container flex flex-col gap-4">
        {users.map((user, index) => {
          if (users.length === index + 1 && !debouncedUserId && !debouncedUsername) {
            return <div ref={lastUserRef} key={user.id}><UserItem user={user} /></div>
          } else {
            return <UserItem key={user.id} user={user} />
          }
        })}
      </div>
    </div>
  )
}

export default UserRoleEditPage
