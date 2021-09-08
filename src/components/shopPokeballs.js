import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ShopPokeballs = () => {
  const [specificPokeballs, setSpecificPokeballs] = useState([]);

  useEffect(() => {
    getPokeballsData();
  }, []);

  let getPokeballsData = async () => {
    const pokeballsData = await fetch("https://pokeapi.co/api/v2/item/");
    const pokeballsInfo = await pokeballsData.json();
    getSpecificPokeballsData(pokeballsInfo.results);
  };

  let getSpecificPokeballsData = async (pokeballsData) => {
    let holdingArray = [];
    pokeballsData.map(async (pokeballsData) => {
      const specificPokeballData = await fetch(pokeballsData.url);
      const specificPokeballInfo = await specificPokeballData.json();
      holdingArray.push(specificPokeballInfo);
      if (holdingArray.length === 20) {
        setSpecificPokeballs(holdingArray);
      }
    });
  };

  if (!specificPokeballs) {
    return <div>Loading...</div>;
  }
  console.log(specificPokeballs);
  return (
    <div classname="test">
      <div id="showcaseAllPokeballs">
        {specificPokeballs.map((pokeball) => {
          return (
            <Link
              className="shopPokemonCard"
              to={`/shopPokeballs/${pokeball.id}`}
            >
              <div>
                <img
                  className="shopPokeballCardImage"
                  src={pokeball.sprites.default}
                ></img>
                <div>{capitalizeFirstLetter(pokeball.name)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ShopPokeballs;
