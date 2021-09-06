import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ShopPokemonIndvidually = ({ match }) => {
  let pokemonId = match.params.id;
  useEffect(() => {
    getSpeciesData();
    getIndividualData();
  }, []);

  const [speciesData, setSpeciesData] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);

  const getSpeciesData = async () => {
    const specificPokemonUrl = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
    );
    const specificPokemonUrlInfo = await specificPokemonUrl.json();
    setSpeciesData(specificPokemonUrlInfo);
    console.log(specificPokemonUrlInfo);
  };

  const getIndividualData = async () => {
    const specificPokemonUrl = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const specificPokemonUrlInfo = await specificPokemonUrl.json();
    setPokemonData(specificPokemonUrlInfo);
    console.log(specificPokemonUrlInfo);
  };

  if (!speciesData || !pokemonData) {
    return <div>Loading...</div>;
  }
  const pokemonBackgroundColor = speciesData.color.name;
  console.log(pokemonBackgroundColor);

  return (
    <div className="showcaseSpecificPokemonScreen">
      <div className="shopSpecificPokemonCard" id={pokemonData.id}>
        <div
          className="shopSpecificPokemonCardName"
          style={{ color: pokemonBackgroundColor }}
        >
          {capitalizeFirstLetter(pokemonData.name)}
        </div>
        <div className="shopSpecificPokemonImages">
          <img
            src={pokemonData.sprites.front_default}
            alt="Fetching"
            className="shopSpecificPokemonCardImage"
          ></img>
          <img
            src={pokemonData.sprites.back_default}
            alt="Fetching"
            className="shopSpecificPokemonCardImage"
          ></img>
        </div>
        {/* <div className="shopSpecificPokemonImages">
          <img
            src={pokemonData.sprites.front_shiny}
            alt="Fetching"
            className="shopSpecificPokemonCardImage"
          ></img>
          <img
            src={pokemonData.sprites.back_shiny}
            alt="Fetching"
            className="shopSpecificPokemonCardImage"
          ></img>
        </div> */}
        <div className="specificPokemonCardLabels">Description</div>
        <div className="shopSpecificPokemonCardDescription">
          {speciesData.flavor_text_entries[10].flavor_text}
        </div>
      </div>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ShopPokemonIndvidually;
