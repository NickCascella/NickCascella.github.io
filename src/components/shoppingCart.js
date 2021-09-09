import react, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShoppingCartContext } from "../Context";

const ShoppingCart = () => {
  const { shoppingCart, setShoppingCart } = useContext(ShoppingCartContext);

  let runningTotal = 0;

  const removeFromCart = (id, itemTotal) => {
    let cartCopy = [...shoppingCart];
    let index = cartCopy.findIndex((element) => element.id === id);
    cartCopy.splice(index, 1);
    setShoppingCart(cartCopy);
    runningTotal -= itemTotal;
  };

  const changeQuantity = (id, itemQuantity, legendary, mythical) => {
    if (itemQuantity < 0) {
      return;
    } else if (legendary === true || mythical === true) {
      itemQuantity = 1;
    }
    let cartCopy = [...shoppingCart];
    let index = cartCopy.findIndex((element) => element.id === id);
    cartCopy[index].quantity = itemQuantity;
    setShoppingCart(cartCopy);
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
                    item.id,
                    e.target.value,
                    item.legendary,
                    item.mythical
                  );
                }}
              ></input>
            </div>
            <div> Price: {item.price} Pokecoins</div>
            <div>Item Total: {itemTotal}</div>
            <button
              onClick={() => {
                removeFromCart(item.id, itemTotal);
              }}
            >
              Remove Item
            </button>
          </div>
        );
      })}
      <div>Running Total: {runningTotal}</div>
    </div>
  );
};

export default ShoppingCart;
