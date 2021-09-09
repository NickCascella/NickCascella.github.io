import { useState, useEffect } from "react";
import { useContext } from "react";
import { GlobalContext } from "../Context";

const ShopSpecificPokeballs = ({ match }) => {
  const { shoppingCart, setShoppingCart, LoadingScreen } =
    useContext(GlobalContext);

  const [specificPokeball, setSpecificPokeball] = useState();
  const [pokeballQuantity, setPokeballQuantity] = useState(0);

  useEffect(() => {
    getPokeballsData();
  }, []);

  let getPokeballsData = async () => {
    const pokeballsData = await fetch(
      `https://pokeapi.co/api/v2/item/${match.params.id}`
    );
    const pokeballsInfo = await pokeballsData.json();
    console.log(pokeballsInfo);
    setSpecificPokeball(pokeballsInfo);
  };

  if (!specificPokeball) {
    return <LoadingScreen></LoadingScreen>;
  }

  const generateId = () => {
    return Math.random() * 1000;
  };

  const checkPrice = () => {
    let price = specificPokeball.cost;
    return price > 0
      ? `${formatNumber(price)} PokeCoins`
      : "Currently Out of Stock";
  };

  const changeQuantity = (e, clicked, increase) => {
    if (pokeballQuantity > 0 && clicked === true && increase === false) {
      setPokeballQuantity(pokeballQuantity - 1);
    } else if (clicked === true && increase === true) {
      const increaedValue = pokeballQuantity + 1;
      setPokeballQuantity(increaedValue);
    } else if (clicked === false && isFinite(e.target.value)) {
      setPokeballQuantity(parseInt(e.target.value));
    }
    e.preventDefault();
  };

  const addToCart = (e, name, quantity, price) => {
    if (price <= 0) {
      e.preventDefault();
      return;
    }

    const itemAdded = {
      id: generateId(),
      name: name,
      imgSrc: specificPokeball.sprites.default,
      quantity: quantity,
      price: price,
      legendary: false,
      mythical: false,
    };

    let cartCopy = [...shoppingCart];
    if (cartCopy.some((pokemon) => pokemon.name === itemAdded.name)) {
      let answer = cartCopy.findIndex(
        (pokemon) => pokemon.name === itemAdded.name
      );
      cartCopy[answer].quantity += itemAdded.quantity;
      setShoppingCart(cartCopy);
      e.preventDefault();
    } else {
      setShoppingCart(shoppingCart.concat(itemAdded));
      e.preventDefault();
    }
  };

  return (
    <div className="specificPokeballScreen">
      <div className="specificPokeballCard">
        <div className="specificPokeballCardLeftSide">
          <div className="specificPokeballCardName">
            {capitalizeFirstLetter(specificPokeball.name)}
          </div>
          <img
            className="specificPokeballCardImage"
            src={specificPokeball.sprites.default}
          ></img>
          <form
            onSubmit={(e) => {
              addToCart(
                e,
                capitalizeFirstLetter(specificPokeball.name),
                pokeballQuantity,
                specificPokeball.cost
              );
            }}
          >
            <div>
              <button
                onClick={(e) => {
                  changeQuantity(e, true, false);
                }}
              >
                -
              </button>
              <input
                className="specificPokemonQuantityDisplay"
                value={pokeballQuantity}
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
        <div className="specificPokeballCardRightSide">
          <div className="specificPokeballSubheading">Category</div>
          <div className="specificPokeballTextData">
            {capitalizeFirstLetter(specificPokeball.category.name)}
          </div>
          <div className="specificPokeballSubheading">Effect Entry</div>
          <div className="specificPokeballTextData">
            {lettersOnly(specificPokeball.effect_entries[0].effect)}
          </div>
          <div className="specificPokeballSubheading">Our humble opinion</div>
          <div className="specificPokeballTextData">
            {lettersOnly(specificPokeball.flavor_text_entries[2].text)}
          </div>
          <div className="specificPokeballSubheading">Price Per Unit</div>
          <div className="specificPokeballTextData">{checkPrice()}</div>
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
  return str.replace(/[^a-zA-Z]/g, " ");
}

export default ShopSpecificPokeballs;
