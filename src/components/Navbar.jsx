import React, { useState } from 'react';
import './Navbar.css';

const types = [
  'All', 'Fire', 'Water', 'Grass', 'Electric', 'Flying', 'Ground',
  'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Fairy', 'Dark', 'Steel', 'Poison'
];

function Navbar({ darkMode, toggleDarkMode, onSearch, onFilter }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-logo">
        <span className="logo-red">Poke</span>View
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <a href="/">Home</a>
        <a href="/favorites">Favorites</a>
        <a href="/teams">My Teams</a>

        <input
          type="text"
          placeholder="Search Pokémon"
          className="search-bar"
          onChange={(e) => onSearch(e.target.value)}
        />

        <select className="type-filter" onChange={(e) => onFilter(e.target.value)}>
          {types.map(type => (
            <option value={type.toLowerCase()} key={type}>
              {type}
            </option>
          ))}
        </select>

        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
