import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [specificPokemon, setSpecificPokemon] = useState([]);
  const [specificPokeballs, setSpecificPokeballs] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    getPokeData();
    getPokeballsData();
  }, []);

  let getPokeData = async () => {
    const pokeData = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=500&offset=0`
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
      if (holdingArray.length === 22) {
        setSpecificPokemon(holdingArray);
      }
    });
  };

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

  if (!specificPokemon || !specificPokeballs) {
    return <div>Loading...</div>;
  }

  const handleSearch = (arrOne, arrTwo, searchInput) => {
    if (searchInput === "") {
      setFilteredPokemon([]);
      setFilteredItems([]);
    } else if (searchInput === "ShowAll") {
      const filteredPokemon = arrOne.filter((value) => {
        const nameMatches = value.name.toLowerCase().includes("");
        return nameMatches;
      });
      const filteredPokeballs = arrTwo.filter((value) => {
        const nameMatches = value.name.toLowerCase().includes("");
        return nameMatches;
      });
      setFilteredPokemon(filteredPokemon);
      setFilteredItems(filteredPokeballs);
    } else {
      const filteredData = arrOne.filter((value) => {
        const searchStr = searchInput.toLowerCase();
        const nameMatches = value.name.toLowerCase().includes(searchStr);
        return nameMatches;
      });
      const filteredPokeballs = arrTwo.filter((value) => {
        const searchStr = searchInput.toLowerCase();
        const nameMatches = value.name.toLowerCase().includes(searchStr);
        return nameMatches;
      });
      setFilteredPokemon(filteredData);
      setFilteredItems(filteredPokeballs);
    }
  };

  return (
    <div>
      <div className="showcasePokemonTitle">Pokemon!</div>
      <input
        type="text"
        className="searchItems"
        onChange={(e) => {
          handleSearch(specificPokemon, specificPokeballs, e.target.value);
        }}
      ></input>
      <div className="showcasePokemonScreen">
        <div className="showcasePokemonCards">
          {filteredPokemon.map((pokemon) => {
            return (
              <div className="shopPokemonCard" id={pokemon.id}>
                <Link
                  to={`/shopPokemon/${pokemon.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="shopPokemonCardImage"
                  ></img>
                  <div className="shopPokemonCardText">
                    {capitalizeFirstLetter(pokemon.name)}
                  </div>
                </Link>
              </div>
            );
          })}
          {filteredItems.map((pokeball) => {
            return (
              <Link
                className="shopPokemonCard"
                to={`/shopPokeballs/${pokeball.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="shopPokemonCard" id={pokeball.id}>
                  <img
                    className="shopPokeballCardImage"
                    src={pokeball.sprites.default}
                  ></img>
                  <div className="shopPokemonCardText">
                    {capitalizeFirstLetter(pokeball.name)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default HomePage;
