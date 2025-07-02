// src/components/PokemonDetails.js
import React, { useEffect, useState } from 'react';

function PokemonDetails() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=650');
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

        setPokemonList(detailedData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  if (loading) return <p>Loading Pokémon details...</p>;

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
    </div>
  );
}

export default PokemonDetails;
