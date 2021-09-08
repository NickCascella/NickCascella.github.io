import react, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShoppingCartContext } from "../Context";

const ShoppingCart = () => {
  const { shoppingCart, setShoppingCart } = useContext(ShoppingCartContext);
  const [grandTotal, setGrandTotal] = useState(0);
  console.log(shoppingCart);
  let runningTotal = 0;

  if (shoppingCart.length === 0) {
    return <div>Empty Cart</div>;
  }

  // const updateTotal = () => {
  //   for (let i = 0; shoppingCart.length; i++) {
  //     console.log(shoppingCart);
  //     // let itemTotal = shoppingCart[i].quantity * shoppingCart[i].price;
  //     // setGrandTotal(grandTotal + itemTotal);
  //   }
  // };

  return (
    <div>
      {shoppingCart.map((item) => {
        let itemTotal = item.quantity * item.price;
        runningTotal += itemTotal;
        return (
          <div>
            <div>Name: {item.name}</div>
            <img src={item.imgSrc}></img>
            <div> Quantity: {item.quantity}</div>
            <div> Price: {item.price} Pokecoins</div>
            <div>Item Total: {itemTotal}</div>
            <button>Remove Item</button>
          </div>
        );
      })}
      <div>Running Total: {runningTotal}</div>
    </div>
  );
};

export default ShoppingCart;
