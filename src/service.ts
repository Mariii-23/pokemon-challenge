import Axios from "axios";
import { IPokemon, IStat } from "./pokemon";

// Base URL for the Pokémon API
const API = "https://pokeapi.co/api/v2";

// Interface representing the response structure from the Pokémon API
interface IPokemonResponse {
    id: string,
    name: string,
    weight: string,
    species: {name: string},
    sprites: {
        front_default: string,
        back_default: string,
    },
    stats: {
        stat: {name: string},
        base_stat: number,
    }[],
    types: {
        type: {
            name: string
        }
    }[],
}

/**
 * Retrieves a list of Pokémon names from the PokéAPI.
 * @returns A promise containing an array of Pokémon names.
 */
const getPokemonsName = async (): Promise<string[]> => {
    const cacheKey = "pokemonNames";

    // Check if Pokémon names are cached in local storage
    const cachedNames = localStorage.getItem(cacheKey);
    if (cachedNames) {
      return JSON.parse(cachedNames);
    }

    try {
        const url = `${API}/pokemon/?offset=0&limit=1302`;
        const response = await Axios.get(url)

        const data = response.data;

        const name = data.results.map((item: {name: string}) => item.name);

        // Cache the Pokémon names in local storage
        localStorage.setItem(cacheKey, JSON.stringify(name));

        return name;
    } catch (error) {
        console.error("Error fetching Pokemons name:", error);
            throw new Error("Error fetching Pokemons name")
    }
}


/**
 * Searches for a Pokémon by name using the PokéAPI.
 * @param name - The name of the Pokémon to search for.
 * @returns A promise containing the Pokémon information.
 */
const searchPokemon = async (name: string): Promise<IPokemon> => {
    const cacheKey = `pokemon_search_${name}`;

    // Check if the Pokémon is cached in local storage
    const pokemon = localStorage.getItem(cacheKey);
    if (pokemon) {
      return JSON.parse(pokemon);
    }

    try {
        const url = `${API}/pokemon/${name}`;
        const response = await Axios.get(url)

        const data = response.data as IPokemonResponse;

        const stat: IStat[] = data.stats.map((element) => ({
          name: element.stat.name,
          base_stat: element.base_stat as number
        } as IStat));

        const categories = data.types.map( element => element.type.name );

        const pokemon =  {
            id: +data.id,
            name: data.name,
            weight: +data.weight,
            speciesName: data.species.name,
            url_front: data.sprites.front_default,
            url_back: data.sprites.back_default,
            stats: stat,
            types: categories,
        } as IPokemon;

        // Cache the Pokémon information in local storage
        localStorage.setItem(cacheKey, JSON.stringify(pokemon));

        return pokemon;
    } catch (error) {
        console.error("Error fetching Pokemon:", error);
            throw new Error("Pokemon not found")
    }
}


// Exported SERVICE containing the Pokémon service functions
export const POKEMON_SERVICE = {
    searchPokemon,
    getAllNames: getPokemonsName
}