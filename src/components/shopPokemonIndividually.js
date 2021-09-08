import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShoppingCartContext } from "../Context";
import ShoppingCart from "./shoppingCart";

const ShopPokemonIndvidually = ({ match }) => {
  const { shoppingCart, setShoppingCart } = useContext(ShoppingCartContext);

  let pokemonId = match.params.id;
  useEffect(() => {
    getSpeciesData();
    getIndividualData();
  }, []);

  const [speciesData, setSpeciesData] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonQuantity, setPokemonQuantity] = useState(0);

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

  //Prevents early render of incomplete API calls
  if (!speciesData || !pokemonData) {
    return <div>Loading...</div>;
  }
  const pokemonBackgroundColor = speciesData.color.name;
  const pokemonCapturePrice = Math.floor(
    (1 / speciesData.capture_rate) * 100000
  );

  const generateId = () => {
    return Math.random() * 1000;
  };

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
    return (
      <div className="specificPokemonMovesList">
        <div>{pokemonData.moves[0].move.name}</div>
        <div>{pokemonData.moves[1].move.name}</div>
        <div>{pokemonData.moves[2].move.name}</div>
        <div>{pokemonData.moves[3].move.name}</div>
      </div>
    );
  };

  const changeQuantity = (e, clicked, increase) => {
    if (pokemonQuantity > 0 && clicked === true && increase === false) {
      setPokemonQuantity(pokemonQuantity - 1);
    } else if (clicked === true && increase === true) {
      const increaedValue = pokemonQuantity + 1;
      setPokemonQuantity(increaedValue);
    } else if (clicked === false && isFinite(e.target.value)) {
      setPokemonQuantity(parseInt(e.target.value));
    }
    e.preventDefault();
  };

  const addToCart = (e, name, quantity, price) => {
    if (price <= 0) {
      e.preventDefault();
      return;
    }

    const pokemonAdded = {
      id: generateId(),
      name: name,
      imgSrc: pokemonData.sprites.front_default,
      quantity: quantity,
      price: price,
    };
    setShoppingCart(shoppingCart.concat(pokemonAdded));
    e.preventDefault();
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

          <form
            onSubmit={(e) => {
              addToCart(
                e,
                capitalizeFirstLetter(pokemonData.name),
                pokemonQuantity,
                pokemonCapturePrice
              );
            }}
          >
            <div className="specificPokemonQuantity">
              <button
                onClick={(e) => {
                  changeQuantity(e, true, false);
                }}
              >
                -
              </button>
              <input
                className="specificPokemonQuantityDisplay"
                value={pokemonQuantity}
                type="number"
                required
                onChange={(e) => {
                  changeQuantity(e, false);
                }}
              ></input>
              <button
                onClick={(e) => {
                  changeQuantity(e, true, true);
                }}
              >
                +
              </button>
            </div>
            <button type="submit">Add</button>
          </form>
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
              (These are examples of some moves it COULD have. This is NOT a
              full list.)
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
