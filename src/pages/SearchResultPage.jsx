import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("key");
 const navigate=useNavigate();
useEffect(()=>{
if(!query)
{
    navigate("/")
}
},[])
      

  return (
    <div>
      <h1>Search Results</h1>
      <p>Query: {query}</p>
    </div>
  );
};

export default SearchResultPage;