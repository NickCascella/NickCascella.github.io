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
    console.log(specificPokemonUrlInfo);
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
        }
        setShoppingCart(cartCopy);
        addToCartNotice("updatingQuantity", e, legendary, mythical);
      } else {
        setShoppingCart(shoppingCart.concat(pokemonAdded));
        addToCartNotice("addToCart", e);
      }
      e.preventDefault();
    }
  };

  const addToCartNotice = (cartNotice, e, legendary, mythical) => {
    // clearTimeout(go);
    let popUp = document.getElementById("cartNoticed");
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
    e.preventDefault();

    setTimeout(() => {
      popUp.style.display = "none";
    }, 1500);
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
          <div id="cartNoticed" className="cartNotice">
            Added to cart
          </div>
          ;
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
              <button
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
  return str.replace(/[^a-zA-Z\é\É]/g, " ");
}

export default ShopPokemonIndvidually;
