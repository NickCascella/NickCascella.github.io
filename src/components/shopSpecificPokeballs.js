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
      addToCartNotice("cannotAdd");
      return;
    }
    e.preventDefault();
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
      let result = cartCopy.findIndex(
        (pokemon) => pokemon.name === itemAdded.name
      );
      cartCopy[result].quantity += itemAdded.quantity;
      setShoppingCart(cartCopy);
      addToCartNotice("updatingQuantity");
    } else {
      setShoppingCart(shoppingCart.concat(itemAdded));
      addToCartNotice("addToCart");
    }
  };

  const addToCartNotice = (cartNotice) => {
    let popUp = document.getElementById("cartUpdatingNotice");
    if (cartNotice === "addToCart") {
      popUp.innerText = "Added to Cart";
    } else if (cartNotice === "updatingQuantity") {
      popUp.innerText = "Updated Quantity";
    } else if (cartNotice === "cannotAdd") {
      popUp.innerText = "Item not in stock";
    }
    popUp.style.display = "flex";

    setTimeout(() => {
      popUp.style.display = "none";
    }, 1500);
  };

  return (
    <div className="showcaseSpecificPokemonScreen">
      <div className="shopSpecificPokemonCard">
        <div className="shopSpecificPokemonCardLeftSide">
          <div className="shopSpecificPokemonCardLeftSideName">
            {capitalizeFirstLetter(specificPokeball.name)}
          </div>
          <img
            className="shopSpecificPokeballLeftSideImage"
            src={specificPokeball.sprites.default}
          ></img>
          <div id="cartUpdatingNotice" class="cartUpdatingNotice">
            Added to cart
          </div>
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
            <div className="shopSpecificPokemonCardLeftSideQuantity">
              <div
                className="shopSpecificPokemonCardLeftSideButtonIncDec"
                onClick={(e) => {
                  changeQuantity(e, true, false);
                }}
              >
                -
              </div>
              <input
                className="shopSpecificPokemonCardLeftSideInput"
                value={pokeballQuantity}
                type="number"
                min="1"
                max="99"
                required
                onChange={(e) => {
                  changeQuantity(e, false);
                }}
              ></input>
              <div
                className="shopSpecificPokemonCardLeftSideButtonIncDec"
                onClick={(e) => {
                  changeQuantity(e, true, true);
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
            Details
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Category
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              {capitalizeFirstLetter(specificPokeball.category.name)}
            </div>
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Effect Entry
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              {lettersOnly(specificPokeball.effect_entries[0].effect)}
            </div>
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Our humble opinion
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              {lettersOnly(specificPokeball.flavor_text_entries[2].text)}
            </div>
          </div>
          <div className="shopSpecificPokemonCardRightSideTextBlocks">
            <div className="shopSpecificPokemonCardRightSideSubTitle">
              Price Per Unit
            </div>
            <div className="shopSpecificPokemonCardRightSideDescription">
              {checkPrice()}
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
  return str.replace(/[^a-zA-Z]/g, " ");
}

export default ShopSpecificPokeballs;
