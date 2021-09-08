import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  // const [pokemonApi, setPokemonApi] = useState(null);
  const [specificPokemon, setSpecificPokemon] = useState([]);
  const [apiOffset, setApiOffset] = useState(0);
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  useEffect(() => {
    getPokeData();
  }, [apiOffset]);

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

  if (!specificPokemon) {
    return <div>Loading...</div>;
  }

  const handleSearch = (arr, searchInput) => {
    const filteredData = arr.filter((value) => {
      const searchStr = searchInput.toLowerCase();
      const nameMatches = value.name.toLowerCase().includes(searchStr);
      return nameMatches;
    });
    setFilteredPokemon(filteredData);
  };

  return (
    <div className="showcasePokemonScreen">
      <div className="showcasePokemonTitle">Pokemon!</div>
      <input
        type="text"
        onChange={(e) => {
          handleSearch(specificPokemon, e.target.value);
        }}
      ></input>
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
          if (apiOffset >= 20) {
            setApiOffset(apiOffset - 20);
          }
        }}
      >
        Previous page
      </button>
      <button
        onClick={() => {
          setApiOffset(apiOffset + 20);
        }}
      >
        Next Page
      </button>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default HomePage;
