import React, { ChangeEvent, useState } from 'react';
import './App.css';
import { IPokemon } from './pokemon';
import { POKEMON_SERVICE } from './service';

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [error, setError] = useState("");
  const [pokemon, setPokemon] = useState<IPokemon>();
  
  const onChangePokemonName = (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      setPokemonName(input)
      setError("");
  }

  const searchPokemon = async (name: string) => {
    try {
      const pokemon = await POKEMON_SERVICE.searchPokemon(name);
      setError("");
      setPokemon(pokemon);
    } catch (error) {
      if (error instanceof Error)
        setError(error.message || "Pokemon not found");
    }
  }

  const onSearchPokemon = async () => {
    if (pokemonName === "") 
      return;
    searchPokemon(pokemonName);
  }

  // TODO:
  const onNextHandler = () => {
  }

  // TODO:
  const onBackHandler = () => {
  }

  return (
    <div className="App">
      <header>
        <h1>Pokémon Stats</h1>
        <div>
          <input
            type="text"
            placeholder="Enter Pokémon Name"
            onChange={onChangePokemonName}
            value={pokemonName}
          />

          <button id="findPokemon" onClick={onSearchPokemon}>Find Pokémon</button>
        </div>
        <p>{error}</p>
      </header>
      
      <button onClick={onBackHandler}>Back</button>
      <button onClick={onNextHandler}>Next</button>

    </div>
  );
}

export default App;
