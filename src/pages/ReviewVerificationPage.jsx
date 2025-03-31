import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ReviewVerificationPage = () => {
  const { id } = useParams();
  const [safeId] = useState(id)
  return (
    <div>ReviewVerificationPage</div>
  )
}

export default ReviewVerificationPage