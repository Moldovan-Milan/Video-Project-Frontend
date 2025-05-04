import React, { useState } from "react";
import "../../styles/NavbarComponent.scss";
import { FaSearch } from "react-icons/fa";
import "../../styles/Search/SearchBar.scss";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchstr, setSearchstr] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchstr) {
      navigate(`/search?key=${searchstr}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="p-4">
      <div className="container mx-auto flex">
        <input
          className="form-input w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 search-input"
          type="search"
          placeholder="Search"
          aria-label="Search"
          style={{ color: "black" }}
          onChange={(e) => {
            setSearchstr(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          value={searchstr}
        ></input>
        <button
          className="text-white px-4 py-2 focus:outline-none focus:ring-2 search-btn"
          onClick={handleSearch}
        >
          <FaSearch />
        </button>
      </div>
    </nav>
  );
};

export default SearchBar;
