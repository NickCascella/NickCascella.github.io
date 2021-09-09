import react, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShoppingCartContext } from "../Context";

const ShoppingCart = () => {
  const { shoppingCart, setShoppingCart } = useContext(ShoppingCartContext);

  let runningTotal = 0;

  const removeFromCart = (id, itemTotal, pokemonArray) => {
    if (pokemonArray === true) {
      let cartCopy = [...shoppingCart];
      let index = cartCopy.findIndex((element) => element.id === id);
      cartCopy.splice(index, 1);
      setShoppingCart(cartCopy);
      runningTotal -= itemTotal;
    }
  };

  const changeQuantity = (
    pokemonArray,
    id,
    itemQuantity,
    legendary,
    mythical
  ) => {
    if (pokemonArray === true) {
      if (itemQuantity < 0) {
        return;
      } else if (legendary === true || mythical === true) {
        itemQuantity = 1;
      }
      let cartCopy = [...shoppingCart];
      let index = cartCopy.findIndex((element) => element.id === id);
      cartCopy[index].quantity = itemQuantity;
      setShoppingCart(cartCopy);
    }
  };

  if (shoppingCart.length === 0) {
    return <div>Empty Cart</div>;
  }

  return (
    <div>
      {shoppingCart.map((item) => {
        let itemTotal = item.quantity * item.price;
        runningTotal += itemTotal;
        return (
          <div id={item.id}>
            <div>Name: {item.name}</div>
            <img src={item.imgSrc}></img>

            <div>
              Quantity:
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  changeQuantity(
                    true,
                    item.id,
                    e.target.value,
                    item.legendary,
                    item.mythical
                  );
                }}
              ></input>
            </div>
            <div> Price: {formatNumber(item.price)} Pokecoins</div>
            <div>Item Total: {formatNumber(itemTotal)} PokeCoins</div>
            <button
              onClick={() => {
                removeFromCart(item.id, itemTotal, true);
              }}
            >
              Remove Item
            </button>
          </div>
        );
      })}
      <div>Sub Total: {formatNumber(runningTotal)} PokeCoins</div>
      <div>
        Sinnoh Provincal Tax:{" "}
        {formatNumber(Math.round(runningTotal * 0.13 * 100) / 100)}
      </div>
      <div>
        Grand Total: {formatNumber(Math.round(runningTotal * 1.13 * 100) / 100)}{" "}
        PokeCoins
      </div>
    </div>
  );
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export default ShoppingCart;
