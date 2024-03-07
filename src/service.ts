import Axios from "axios";
import { IPokemon, IStat } from "./pokemon";

const API = "https://pokeapi.co/api/v2";

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

const searchPokemon = async (name: string): Promise<IPokemon> => {
    try {
        const url = `${API}/pokemon/${name}`;
        const response = await Axios.get(url)

        const data = response.data as IPokemonResponse;
        console.log(data)

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

        return pokemon;
    } catch (error) {
        console.error("Error fetching Pokemon:", error);
            throw new Error("Pokemon not found")
    }
}


export const POKEMON_SERVICE = {
    searchPokemon,
}