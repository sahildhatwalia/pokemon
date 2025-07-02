// src/App.js
import React from 'react';
import DittoInfo from './components/DittoInfo';

function App() {
  return (
    <div className="App">
      <h1>PokeCards</h1>
      <DittoInfo className="pokie" />
      <p className='ends'>PokeView – for a visual gallery</p>
    </div>
  );
}

export default App;
