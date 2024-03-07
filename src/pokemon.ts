export interface IStat {
    name: string,
    base_stat: number,
}

export interface IPokemon {
    id: number,
    name:string,
    weight:number,
    speciesName:string,
    url_front: string,
    url_back: string,
    stats: IStat[],
    types: string[],
}