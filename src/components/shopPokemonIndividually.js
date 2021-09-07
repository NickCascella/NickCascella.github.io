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
  const pokemonCapturePrice = Math.floor(
    (1 / speciesData.capture_rate) * 100000
  );

  const organizePokemonStats = () => {
    return pokemonData.stats.map((stats) => {
      return (
        <div>
          {stats.stat.name} : {stats.base_stat}
        </div>
      );
    });
  };

  const pickRandomMoves = () => {
    const number = () => {
      return Math.floor(Math.random() * pokemonData.moves.length);
    };
    return (
      <div className="specificPokemonMovesList">
        <div>{pokemonData.moves[number()].move.name}</div>
        <div>{pokemonData.moves[number()].move.name}</div>
        <div>{pokemonData.moves[number()].move.name}</div>
        <div>{pokemonData.moves[number()].move.name}</div>
        <div>{pokemonData.moves[number()].move.name}</div>
        <div>{pokemonData.moves[number()].move.name}</div>
        <div>{pokemonData.moves[number()].move.name}</div>
      </div>
    );
  };

  return (
    <div className="showcaseSpecificPokemonScreen">
      <div className="shopSpecificPokemonCard" id={pokemonData.id}>
        <div className="specificPokemonTitleAndImage">
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
          <button>Add+</button>
        </div>

        <div className="specificPokemonCardDetails">
          <div className="specificPokemonCardDetailsTitle">Details</div>
          <div className="specificPokemonDescription">
            <div className="specificPokemonSubTitle">Description:</div>
            <div className="shopSpecificPokemonCardDescription">
              {speciesData.flavor_text_entries[12].flavor_text}
            </div>
          </div>
          <div className="specificPokemonPotentialMoves">
            <div className="specificPokemonSubTitle">Potential Moves:</div>
            <div className="shopSpecificPokemonCardDescription">
              (Can have up to four. This is NOT a full list.)
            </div>
            <div className="specificPokemonMovesList">
              <div>{pickRandomMoves()}</div>
            </div>
          </div>
          <div className="specificPokemonPotentialMoves">
            <div className="specificPokemonSubTitle">Base Stats:</div>
            <div>{organizePokemonStats()}</div>
          </div>
          <div className="specificPokemonPotentialMoves">
            <div className="specificPokemonSubTitle">Cost of Acquistion:</div>
            <div className="shopSpecificPokemonCardDescription">
              {formatNumber(pokemonCapturePrice)} PokeCoins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export default ShopPokemonIndvidually;
