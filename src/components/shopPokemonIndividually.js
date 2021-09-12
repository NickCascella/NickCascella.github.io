import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../Context";

const ShopPokemonIndvidually = ({ match }) => {
  const { shoppingCart, setShoppingCart, LoadingScreen } =
    useContext(GlobalContext);

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
  };

  const getIndividualData = async () => {
    const specificPokemonUrl = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const specificPokemonUrlInfo = await specificPokemonUrl.json();

    setPokemonData(specificPokemonUrlInfo);
  };

  //Prevents early render of incomplete API calls
  if (!speciesData || !pokemonData) {
    return <LoadingScreen></LoadingScreen>;
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
          {capitalizeFirstLetter(stats.stat.name)} : {stats.base_stat}
        </div>
      );
    });
  };

  const pickRandomMoves = () => {
    //handles pokemon like ditto
    if (pokemonData.moves[3] === undefined) {
      return (
        <div>
          <div>{capitalizeFirstLetter(pokemonData.moves[0].move.name)}</div>
          <div>Other move data currently unavailible</div>
        </div>
      );
    } else {
      return (
        <div>
          <div>{capitalizeFirstLetter(pokemonData.moves[0].move.name)}</div>
          <div>{capitalizeFirstLetter(pokemonData.moves[1].move.name)}</div>
          <div>{capitalizeFirstLetter(pokemonData.moves[2].move.name)}</div>
          <div>{capitalizeFirstLetter(pokemonData.moves[3].move.name)}</div>
        </div>
      );
    }
  };

  const changeQuantity = (e, clicked, increase, mythical, legendary) => {
    if (
      (mythical === true || legendary === true) &&
      increase === false &&
      clicked === true
    ) {
      setPokemonQuantity(0);
    } else if (
      (mythical === true || legendary === true) &&
      increase === null &&
      clicked === false
    ) {
      if (pokemonQuantity === 1) {
        setPokemonQuantity(0);
      } else if (pokemonQuantity === 0) {
        setPokemonQuantity(1);
      }
    } else if (mythical === true || legendary === true) {
      setPokemonQuantity(1);
    } else if (pokemonQuantity > 0 && clicked === true && increase === false) {
      setPokemonQuantity(pokemonQuantity - 1);
    } else if (clicked === true && increase === true) {
      const increaedValue = pokemonQuantity + 1;
      setPokemonQuantity(increaedValue);
    } else if (clicked === false && isFinite(e.target.value)) {
      setPokemonQuantity(parseInt(e.target.value));
    }
    e.preventDefault();
  };

  const addToCart = (e, name, quantity, price, legendary, mythical) => {
    if (price <= 0 || quantity === 0) {
      e.preventDefault();
    } else {
      e.preventDefault();
      const pokemonAdded = {
        id: generateId(),
        name: name,
        imgSrc: pokemonData.sprites.front_default,
        quantity: quantity,
        price: price,
        legendary: legendary,
        mythical: mythical,
      };

      let cartCopy = [...shoppingCart];
      if (cartCopy.some((pokemon) => pokemon.name === pokemonAdded.name)) {
        let answer = cartCopy.findIndex(
          (pokemon) => pokemon.name === pokemonAdded.name
        );
        if (
          !cartCopy[answer].legendary === true &&
          !cartCopy[answer].mythical === true
        ) {
          cartCopy[answer].quantity += pokemonAdded.quantity;
          if (cartCopy[answer].quantity > 99) {
            cartCopy[answer].quantity = 99;
          }
        }
        setShoppingCart(cartCopy);
        addToCartNotice("updatingQuantity", legendary, mythical);
      } else {
        setShoppingCart(shoppingCart.concat(pokemonAdded));
        addToCartNotice("addToCart");
      }
    }
  };

  const addToCartNotice = (cartNotice, legendary, mythical) => {
    let popUp = document.getElementById("cartUpdatingNotice");
    if (cartNotice === "addToCart") {
      popUp.innerText = "Added to Cart";
    } else if (
      cartNotice === "updatingQuantity" &&
      legendary === false &&
      mythical === false
    ) {
      popUp.innerText = "Updated Quantity";
    } else if (legendary === true || mythical === true) {
      popUp.innerText = "Cannot add this same Lengendary";
    }
    popUp.style.display = "flex";

    setTimeout(() => {
      popUp.style.display = "none";
    }, 1500);
  };

  return (
    <div className="showcaseSpecificPokemonScreen">
      <div className="shopSpecificPokemonCard" id={pokemonData.id}>
        <div className="shopSpecificPokemonCardLeftSide">
          <div
            className="shopSpecificPokemonCardLeftSideName"
            style={{ color: pokemonBackgroundColor }}
          >
            {capitalizeFirstLetter(pokemonData.name)}
          </div>
          <div className="shopSpecificPokemonCardLeftSideImages">
            <img
              src={pokemonData.sprites.front_default}
              alt="Fetching"
              className="shopSpecificPokemonCardLeftSideImage"
            ></img>
            <img
              src={pokemonData.sprites.back_default}
              alt="Fetching"
              className="shopSpecificPokemonCardLeftSideImage"
            ></img>
          </div>
          <div id="cartUpdatingNotice" class="cartUpdatingNotice">
            Added to cart
          </div>
          <form
            onSubmit={(e) => {
              addToCart(
                e,
                capitalizeFirstLetter(pokemonData.name),
                pokemonQuantity,
                pokemonCapturePrice,
                speciesData.is_legendary,
                speciesData.is_mythical,
                true
              );
            }}
          >
            <div className="shopSpecificPokemonCardLeftSideQuantity">
              <div
                className="shopSpecificPokemonCardLeftSideButtonIncDec"
                onClick={(e) => {
                  changeQuantity(
                    e,
                    true,
                    false,
                    speciesData.is_mythical,
                    speciesData.is_legendary
                  );
                }}
              >
                -
              </div>
              <input
                className="shopSpecificPokemonCardLeftSideInput"
                value={pokemonQuantity}
                type="number"
                min="1"
                max="99"
                required
                onChange={(e) => {
                  changeQuantity(
                    e,
                    false,
                    null,
                    speciesData.is_mythical,
                    speciesData.is_legendary
                  );
                }}
              ></input>
              <div
                className="shopSpecificPokemonCardLeftSideButtonIncDec"
                onClick={(e) => {
                  changeQuantity(
                    e,
                    true,
                    true,
                    speciesData.is_mythical,
                    speciesData.is_legendary
                  );
                }}
              >
                +
              </div>
            </div>
            <button className="addToCart" type="submit">
              Add to Cart
            </button>
          </form>
        </div>

        <div className="shopSpecificPokemonCardRightSide">
          <div className="shopSpecificPokemonCardRightSideDetailsTitle">
            Pokedex Entry #{pokemonData.id}
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Description
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              {lettersOnly(speciesData.flavor_text_entries[6].flavor_text)}
            </div>
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Potential Moves
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              (This is NOT a full list)
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              <div>{pickRandomMoves()}</div>
            </div>
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Base Stats
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              {organizePokemonStats()}
            </div>
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Cost of Acquistion
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
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

function lettersOnly(str) {
  const newStr = capitalizeFirstLetter(str.toLowerCase());
  return newStr.replace(/[^a-zA-Z\é\É\’]/g, " ");
}

export default ShopPokemonIndvidually;

{
  /* <div className="showcaseSpecificPokemonScreen">
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
    <div id="cartNoticed" className="cartNotice">
      Added to cart
    </div>
    <form
      onSubmit={(e) => {
        addToCart(
          e,
          capitalizeFirstLetter(pokemonData.name),
          pokemonQuantity,
          pokemonCapturePrice,
          speciesData.is_legendary,
          speciesData.is_mythical,
          true
        );
      }}
    >
      <div className="specificPokemonQuantity">
        <button
          onClick={(e) => {
            changeQuantity(
              e,
              true,
              false,
              speciesData.is_mythical,
              speciesData.is_legendary
            );
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
            changeQuantity(
              e,
              false,
              null,
              speciesData.is_mythical,
              speciesData.is_legendary
            );
          }}
        ></input>
        <div
          onClick={(e) => {
            changeQuantity(
              e,
              true,
              true,
              speciesData.is_mythical,
              speciesData.is_legendary
            );
          }}
        >
          +
        </div>
      </div>
      <button type="submit">Add</button>
    </form>
  </div>

  <div className="specificPokemonCardDetails">
    <div className="specificPokemonCardDetailsTitle">Details</div>
    <div className="specificPokemonDescription">
      <div className="specificPokemonSubTitle">Description:</div>
      <div className="shopSpecificPokemonCardDescription">
        {lettersOnly(speciesData.flavor_text_entries[7].flavor_text)}
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
</div> */
}
