import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context";

const ShopPokemon = () => {
  const { LoadingScreen } = useContext(GlobalContext);
  const [specificPokemon, setSpecificPokemon] = useState([]);
  const [apiOffset, setApiOffset] = useState(0);

  useEffect(() => {
    getPokeData();
  }, [apiOffset]);

  let getPokeData = async () => {
    const pokeData = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${apiOffset}`
    );
    const pokeInfo = await pokeData.json();

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

  if (!specificPokemon) {
    return <LoadingScreen></LoadingScreen>;
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
      <button
        onClick={() => {
          if (apiOffset >= 20 && apiOffset !== 800) {
            setApiOffset(apiOffset - 20);
          }
        }}
      >
        Previous page
      </button>
      <button
        onClick={() => {
          if (apiOffset != 800) {
            setApiOffset(apiOffset + 20);
          }
        }}
      >
        Next Page
      </button>
      <div>
        Page Number: {apiOffset / 20} / {40}
      </div>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ShopPokemon;
