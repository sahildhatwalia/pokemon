import React, { useEffect, useState } from 'react';
import AnimatedPokemonCard from './AnimatedPokemonCard';

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

            const abilities = pokeData.abilities.map((a) => a.ability.name);

            const locRes = await fetch(pokeData.location_area_encounters);
            const locationData = await locRes.json();
            const locations = locationData.map((l) => l.location_area.name);

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

            const staticImage = pokeData.sprites.other['official-artwork'].front_default;
            const animatedImage = pokeData.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;

            return {
              name: pokeData.name,
              abilities,
              locations,
              evolution: evolutionNames.join(' → '),
              staticImage,
              animatedImage,
            };
          })
        );

        setPokemonList((prev) => [...prev, ...detailedData]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonBatch();
  }, [offset]);

  const renderSkeletonCards = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className="shimmer-card"></div>
    ));
  };

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
        {loading && pokemonList.length === 0
          ? renderSkeletonCards()
          : pokemonList.map((p, index) => (
              <AnimatedPokemonCard
                key={index}
                name={p.name}
                staticImage={p.staticImage}
                animatedImage={p.animatedImage}
                abilities={p.abilities}
                evolution={p.evolution}
                locations={p.locations}
              />
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
        {loading && pokemonList.length > 0 ? 'Loading...' : 'Load More'}
      </button>

      {/* Shimmer Card Styles */}
      <style>{`
        .shimmer-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          width: 220px;
          height: 300px;
        }

        .shimmer-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150px;
          width: 100px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -150px;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default PokemonDetails;
