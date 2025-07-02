// src/components/PokemonDetails.js
import React, { useEffect, useState } from 'react';

function PokemonDetails() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchPokemonBatch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await res.json();

        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokeRes = await fetch(pokemon.url);
            const pokeData = await pokeRes.json();

            // Abilities
            const abilities = pokeData.abilities.map((a) => a.ability.name);

            // Location Area Encounters
            const locRes = await fetch(pokeData.location_area_encounters);
            const locationData = await locRes.json();
            const locations = locationData.map((l) => l.location_area.name);

            // Evolution Chain
            const speciesRes = await fetch(pokeData.species.url);
            const speciesData = await speciesRes.json();
            const evoRes = await fetch(speciesData.evolution_chain.url);
            const evoData = await evoRes.json();

            const evolutionNames = [];
            let current = evoData.chain;
            while (current) {
              evolutionNames.push(current.species.name);
              current = current.evolves_to[0];
            }

            // Official Artwork (static image)
            const image = pokeData.sprites.other['official-artwork'].front_default;

            return {
              name: pokeData.name,
              abilities,
              locations,
              evolution: evolutionNames.join(' → '),
              image,
            };
          })
        );

        // Append new batch to existing list
        setPokemonList((prev) => [...prev, ...detailedData]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonBatch();
  }, [offset]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Pokemon Details</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {pokemonList.map((p, index) => (
          <div
            key={index}
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
              src={p.image || 'https://via.placeholder.com/150'}
              alt={p.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'contain',
                marginBottom: '10px',
              }}
            />
            <h3>{p.name.toUpperCase()}</h3>
            <p><strong>Abilities:</strong><br />{p.abilities.join(', ') || 'None'}</p>
            <p><strong>Evolution:</strong><br />{p.evolution || 'None'}</p>
            <p><strong>Locations:</strong><br />{p.locations.slice(0, 3).join(', ') || 'Unknown'}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOffset(offset + limit)}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '10px',
  color: 'rgb(219, 207, 210)',
    backgroundColor: 'rgb(39, 72, 17)',

          
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}

export default PokemonDetails;
