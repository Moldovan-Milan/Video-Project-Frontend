import React from "react";
import "../components/NavbarComponent.scss";
import { FaSearch } from "react-icons/fa";
import "../components/SearchBar.scss";
<<<<<<< HEAD

const SearchBar = ({searchButtonDownFunction}) => {
=======
>>>>>>> 17d53ae5269d819db41dd90c1cc1908aa8f121c3

  return (
    <nav className="p-4">
      <div className="container mx-auto">
        <form className="flex" role="search">
          <input  
            className="form-input w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 search-input"
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={{color: "black"}}
          ></input>
<<<<<<< HEAD
          <button className="text-white px-4 py-2 focus:outline-none focus:ring-2 search-btn" onClick={searchButtonDownFunction}>
=======
          <button className="text-white px-4 py-2 focus:outline-none focus:ring-2 search-btn" type="submit">
>>>>>>> 17d53ae5269d819db41dd90c1cc1908aa8f121c3
            <FaSearch/>
          </button>
        </form>
      </div>
    </nav>
  );
};

export default SearchBar;
