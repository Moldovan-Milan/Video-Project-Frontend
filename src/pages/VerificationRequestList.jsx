import React, { useCallback, useRef, useState, useEffect } from "react";
import axios from "axios";
import VerificationRequestItem from "../components/VerificationRequestItem";

const VerificationRequestList = () => {
  const [requestList, setRequestList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 1;
  const observerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `api/admin/verification-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`,
          {
            withCredentials:true
          }
        );

        const { users, hasMore } = response.data;

        setRequestList((prevUsers) => {
          const filteredUsers = users.filter(
            (newUser) => !prevUsers.some((user) => user.id === newUser.id)
          );
          return [...prevUsers, ...filteredUsers];
        });

        setHasMore(hasMore);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, [pageNumber]);

  const handleRequestProcessed = (userId) => {
    setRequestList((prevRequests) =>
      prevRequests.filter((request) => request.id !== userId)
    );
  };
  

  const lastUserRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div>
      {requestList.length > 0 ? (
        requestList.map((request, index) => {
          const isLastRequest = index === requestList.length - 1;
          return (
            <VerificationRequestItem
              user={request}
              key={request.id}
              ref={isLastRequest ? lastUserRef : null}
              onRequestProcessed={handleRequestProcessed}
            />
          );
        })
      ) : hasMore ? (
        <p>Loading...</p>
      ) : (
        <p>No verification requests available.</p>
      )}
    </div>
  );
  
};

export default VerificationRequestList;
