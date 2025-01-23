import React from "react";
import "../components/NavbarComponent.scss";
import { FaSearch } from "react-icons/fa";
import "../components/SearchBar.scss";

const SearchBar = () => {
  return (
    <nav className="p-4">
      <div className="container mx-auto">
        <form className="flex" role="search">
          <input
            className="form-input w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={{color: "black"}}
          ></input>
          <button className="text-white px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 search-btn" type="submit">
            <FaSearch/>
          </button>
        </form>
      </div>
    </nav>
  );
};

export default SearchBar;
