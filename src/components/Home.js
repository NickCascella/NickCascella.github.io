import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context";

const HomePage = () => {
  const { LoadingScreen } = useContext(GlobalContext);
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
      `https://pokeapi.co/api/v2/pokemon?limit=801&offset=0`
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
      if (holdingArray.length === 799) {
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
    return <LoadingScreen></LoadingScreen>;
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
    <div id="homeScreen">
      <div id="homeScreenWelcome">
        <div id="homeScreenWelcomeTitle">
          Welcome to the <i>Pokemon Hub</i>!
        </div>{" "}
        <div id="homeScreenWelcomeMessage">
          Browse our selection of 821 Pokemon and Pokemon related items! Know
          exactly what your're looking for? Feel free to use our master search
          bar here and find it instantly!
        </div>
        <div id="homeScreenCommandNote">
          (The <i>ShowAll</i> command will pull all data up at once)
        </div>
        <input
          type="text"
          id="searchItems"
          onChange={(e) => {
            handleSearch(specificPokemon, specificPokeballs, e.target.value);
          }}
        ></input>
      </div>
      <div className="showcaseAllScreen">
        <div className="showcaseHomeCards">
          {filteredPokemon.map((pokemon) => {
            return (
              <div className="shopPokemonCard" id={pokemon.id} key={pokemon.id}>
                <Link
                  to={`/shopPokemon/${pokemon.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="shopPokemonCardImage"
                    alt="pokemon front view"
                  ></img>
                  <div className="shopPokemonCardText">
                    #{pokemon.id} {capitalizeFirstLetter(pokemon.name)}
                  </div>
                </Link>
              </div>
            );
          })}
          {filteredItems.map((pokeball) => {
            return (
              <div
                className="shopPokemonCard"
                id={pokeball.id}
                key={pokeball.id}
              >
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
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default HomePage;
