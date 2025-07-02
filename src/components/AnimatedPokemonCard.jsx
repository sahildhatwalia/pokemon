// src/components/AnimatedPokemonCard.jsx
import React, { useState } from 'react';
import './AnimatedPokemonCard.css';
import './DittoInfo'
function AnimatedPokemonCard({ name, staticImage, animatedImage, abilities, evolution, locations }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '2px solid #ccc',
        borderRadius: '15px',
        width: '220px',
        padding: '10px',
        backgroundColor: '#f7f7f7',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        textAlign: 'center',
      }}
    >
      <img 
        src={hovered && animatedImage ? animatedImage : staticImage}
        alt={name}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'contain',
          marginBottom: '10px',
        }}
      />
      <h3>{name.toUpperCase()}</h3>
      <p><strong>Abilities:</strong><br />{abilities.join(', ') || 'None'}</p>
      <p><strong>Evolution:</strong><br />{evolution || 'None'}</p>
      <p><strong>Locations:</strong><br />{locations.slice(0, 3).join(', ') || 'Unknown'}</p>
    </div>
  );
}

export default AnimatedPokemonCard;
