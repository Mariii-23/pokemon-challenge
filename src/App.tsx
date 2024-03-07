import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import { POKEMON_SERVICE } from './service';
import { IPokemon } from './pokemon';

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
        console.error(e);
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

  const onSelectSuggestion = async (suggestion: string) => {
    await searchPokemon(suggestion);
    setPokemonName(suggestion)
    setError("");
    setsuggestions([]);
  }

  const onNextHandler = () => {
    if (pokemon) 
      searchPokemon((pokemon.id+1).toString())
  }

  const onBackHandler = () => {
    if (pokemon) {
      searchPokemon((pokemon.id-1).toString())
    }
  }


  return (
    <div className="App">
      <header>
          <h1>Pokémon Stats</h1>
          <div className="input-suggestions-container">
            <div className="input-container">
              <div className="suggestions-container">
                <input 
                  id="searchInput"
                  type="text"
                  placeholder="Enter Pokémon Name"
                  onChange={onChangePokemonName}
                  value={pokemonName}
                />
                {
                  suggestions.map((suggestion, index) => 
                      <p key={index} onClick={() => onSelectSuggestion(suggestion)}>
                        {suggestion}
                      </p>
                    )
                }
              </div>
              <div>
                <button id="findPokemon" onClick={onSearchPokemon}>Find</button>
              </div>
            </div>
          </div>
          { error !== "" &&
            <div className="error-container">
              <p>{error}</p>
            </div>
          }
      </header>

      {pokemon &&
      <div className="pokemon-container">
        <div className="pokemon-title-container">
          <h1>{pokemon.name}</h1>
          <h1 className="pokemon-number">#{pokemon.id}</h1>
        </div>

        <div className="pokemon-header">
          <div className="pokemon-images">
            <img src={pokemon.url_front} alt=""/>
            <img src={pokemon.url_back} alt=""/>
          </div>

          <div className="pokemon-info-container">
            <div className="pokemon-detail-container">

              <div>
                <h5>Weight:</h5>
                <p>
                  {pokemon.weight}
                </p>
              </div>

              <div>
                <h5>Species:</h5>
                <p>
                  {pokemon.speciesName}
                </p>
              </div>

              <div>
                <h5>Types:</h5>
                {pokemon.types.map((item,index) =>
                  <p key={index}>
                   {item}
                  </p>
                )}
              </div>
            </div>

            <div className="stats-container">
              {pokemon.stats.map((stat,index) => (
                <div className="stat" key={index}> 
                  <h5>{stat.name}: </h5>
                  <p>{stat.base_stat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="buttons">
          <button onClick={onBackHandler}>Back</button>
          <button onClick={onNextHandler}>Next</button>
        </div>
      </div>
      }
    </div>
  );
}

export default App;
