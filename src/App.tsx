import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import { IPokemon } from './pokemon';
import { POKEMON_SERVICE } from './service';

const N_MATCHES = 5;

const findMatches = (input: string, stringLists: string[]): string[] => {
    if (input === "") 
      return [];

    const lowercaseInput = input.toLowerCase();
    const matches: string[] = [];

    for (const elem of stringLists) {
      if (elem.toLowerCase().includes(lowercaseInput)) {
        matches.push(elem);

        if (matches.length === N_MATCHES) {
          return matches; 
        }
      }
    }

    return matches; 
}

function App() {
  const [pokemonsNameList, setPokemonsNameList] = useState<string[]>([]);

  const [pokemonName, setPokemonName] = useState("");
  const [error, setError] = useState("");
  const [pokemon, setPokemon] = useState<IPokemon>();
  
  const [suggestions, setsuggestions] = useState<string[]>([])

  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
        const names = await POKEMON_SERVICE.getAllNames();
        setPokemonsNameList(names);
      } catch (e) {
        console.error("Error fetching Pokemon names");
      }
    };

    fetchPokemonNames();
  }, []); 

  const onChangePokemonName = (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      setPokemonName(input)
      setError("");
      setsuggestions(findMatches(input, pokemonsNameList));
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
    setsuggestions([]);
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
          <div>
            <input
              type="text"
              placeholder="Enter Pokémon Name"
              onChange={onChangePokemonName}
              value={pokemonName}
            />
            {
              suggestions.map((suggestion, index) => 
                  <p key={index}>
                    {suggestion}
                  </p>
                )
            }
          </div>

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
