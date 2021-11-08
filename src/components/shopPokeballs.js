import react, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context";

const ShopPokeballs = () => {
  const { LoadingScreen } = useContext(GlobalContext);
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
    return <LoadingScreen></LoadingScreen>;
  }

  return (
    <div id="showcasePokeballsScreen">
      <div className="showcasePokemonTitle">
        View our selection of pokeball's and extras!
      </div>
      <div className="showcasePokemonCards">
        {specificPokeballs.map((pokeball) => {
          return (
            <div className="shopPokemonCard" key={pokeball.id}>
              <Link
                to={`/shopPokeballs/${pokeball.id}`}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="shopPokemonCardImage"
                  src={pokeball.sprites.default}
                  alt="pokeball image"
                ></img>
                <div className="shopPokemonCardText">
                  {capitalizeFirstLetter(pokeball.name)}
                </div>
              </Link>
            </div>
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
