import react, { useEffect, useState } from "react";

const ShopPokemon = () => {
  const [pokemonApi, setPokemonApi] = useState(null);
  const [specificPokemon, setSpecificPokemon] = useState([]);

  useEffect(() => {
    getPokeData();
  }, []);

  let getPokeData = async () => {
    const pokeData = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=20&offset=100"
    );
    const pokeInfo = await pokeData.json();
    setPokemonApi(pokeInfo.results);
    getIndividualPokemonData(pokeInfo.results);
  };

  let getIndividualPokemonData = async (results) => {
    results.map(async (result) => {
      const specificPokeData = await fetch(result.url);
      const specificPokeInfo = await specificPokeData.json();
      setSpecificPokemon(specificPokemon.concat(specificPokeInfo));
    });
  };

  if (!pokemonApi) {
    return <div>Loading...</div>;
  }

  // let render = () => {
  //   return (
  //     <div className="App">
  //         {pokemonApi && (
  // <img src={pokemonApi.sprites.front_default} alt="Fetching"></img>
  // )}
  //     </div>
  //   );
  // };

  return (
    <div className="App">
      {/* {console.log(specificPokemon)}
      {pokemonApi.map((pokemon) => {
        return (
          <div>
            <div>{pokemon.name}</div>
            {pokemonApi && (
              <img src={pokemonApi.sprites.front_default} alt="Fetching"></img>
            )}
          </div>
        );
      })}
       */}
    </div>
  );
};

export default ShopPokemon;
