import React from 'react'
import axios from "axios"
import {useState, useEffect} from "react"

const VerificationRequestList = () => {
  const [requestList, setRequestList] = useState([])

  useEffect(() => {
    const fetchRequests = async () => {
        axios.get("")
    }
  }, [])
  
  return (
    <div>VerificationRequestList</div>
  )
}

export default VerificationRequestList