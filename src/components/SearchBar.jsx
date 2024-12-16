import React from "react";
import "../components/NavbarComponent.scss";

const SearchBar = () => {
  return (
    <nav className="navbar searchbar">
      <div className="container-fluid">
        <form className="d-flex" role="search">
          <input
            className="form-control me-2 search-input"
            type="search"
            placeholder="Search"
            aria-label="Search"
          ></input>
          <button className="btn btn-search" type="submit">
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default SearchBar;
