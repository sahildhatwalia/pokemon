// src/App.js
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import DittoInfo from './components/DittoInfo';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 🌙 Load saved theme from localStorage on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  // 💾 Apply theme to body and save to localStorage when toggled
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onSearch={setSearch}
        onFilter={setFilterType}
      />
      <div className="App">
        <h1 className="title">PokeCards</h1>
        <DittoInfo search={search} filterType={filterType} className="pokie" />
        <p className="ends">PokeView – for a visual gallery</p>
      </div>
    </>
  );
}

export default App;
