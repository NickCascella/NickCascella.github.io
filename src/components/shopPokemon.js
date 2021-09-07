import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ShopPokemon = () => {
  // const [pokemonApi, setPokemonApi] = useState(null);
  const [specificPokemon, setSpecificPokemon] = useState([]);
  const [apiOffset, setApiOffset] = useState(0);

  useEffect(() => {
    getPokeData();
  }, []);

  let getPokeData = async () => {
    const pokeData = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${apiOffset}`
    );
    const pokeInfo = await pokeData.json();
    // setPokemonApi(pokeInfo.results);
    getIndividualPokemonData(pokeInfo.results);
  };

  let getIndividualPokemonData = async (results) => {
    let holdingArray = [];
    results.map(async (result) => {
      const specificPokeData = await fetch(result.url);
      const specificPokeInfo = await specificPokeData.json();
      holdingArray.push(specificPokeInfo);
      if (holdingArray.length === 20) {
        setSpecificPokemon(holdingArray);
      }
    });
  };

  const nextPage = () => {
    setApiOffset(apiOffset + 20);
    getPokeData();
  };

  const previousPage = () => {
    if (apiOffset === -20) {
      return;
    }
    setApiOffset(apiOffset - 20);
    getPokeData();
  };

  if (!specificPokemon) {
    return <div>Loading...</div>;
  }
  return (
    <div className="showcasePokemonScreen">
      <div className="showcasePokemonTitle">Pokemon!</div>
      <div className="showcasePokemonCards">
        {specificPokemon.map((pokemon) => {
          return (
            <div className="shopPokemonCard" id={pokemon.id}>
              <Link
                to={`/shopPokemon/${pokemon.id}`}
                style={{ textDecoration: "none" }}
              >
                <img
                  src={pokemon.sprites.front_default}
                  alt="Fetching"
                  className="shopPokemonCardImage"
                ></img>
                <div className="shopPokemonCardText">
                  {capitalizeFirstLetter(pokemon.name)}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <button onClick={previousPage}>Previous page</button>
      <button onClick={nextPage}>Next Page</button>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ShopPokemon;
