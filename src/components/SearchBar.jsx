import React, { useState } from "react";
import "../styles/NavbarComponent.scss";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.scss";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {

  const[searchstr,setSearchstr]=useState("");
  const navigate=useNavigate();

  return (
    <nav className="p-4">
      <div className="container mx-auto flex">
          <input
            className="form-input w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 search-input"
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={{ color: "black" }}
            onChange={(e)=>{setSearchstr(e.target.value)}}
            value={searchstr}
          ></input>
          <button
            className="text-white px-4 py-2 focus:outline-none focus:ring-2 search-btn"
            onClick={searchstr?()=>navigate(`/search?key=${searchstr}`):()=>window.alert("Type in a word to search for!")}
          >
            <FaSearch />
          </button>
      </div>
    </nav>
  );
};

export default SearchBar;
