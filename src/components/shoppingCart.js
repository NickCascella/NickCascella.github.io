import { useContext } from "react";
import { GlobalContext } from "../Context";

const ShoppingCart = () => {
  const { shoppingCart, setShoppingCart } = useContext(GlobalContext);

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
      if (itemQuantity < 1 || itemQuantity > 99) {
        return;
      } else if (legendary === true || mythical === true) {
        itemQuantity === 1 ? (itemQuantity = 0) : (itemQuantity = 1);
      }
      let cartCopy = [...shoppingCart];
      let index = cartCopy.findIndex((element) => element.id === id);
      cartCopy[index].quantity = itemQuantity;
      setShoppingCart(cartCopy);
    }
  };

  if (shoppingCart.length === 0) {
    return (
      <div id="shoppingCartEmpty">
        <p id="shoppingCartEmptyText"> Empty Cart</p>
      </div>
    );
  }

  return (
    <div id="shoppingCartScreen">
      <div id="shoppingCartData">
        {shoppingCart.map((item) => {
          let itemTotal = item.quantity * item.price;
          runningTotal += itemTotal;
          return (
            <div id={item.id} className="shoppingCartItem" key={item.id}>
              <div className="shoppingCartItemName">{item.name}</div>
              <img
                className="shoppingCartItemImg"
                src={item.imgSrc}
                alt={item.id}
              ></img>

              <div className="shoppingCartItemSubContainer">
                <div className="shoppingCartItemSubContainerTitle">
                  Quantity
                </div>
                <input
                  className="shoppingCartItemQuantityInput"
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
              <div className="shoppingCartItemSubContainer">
                <div className="shoppingCartItemSubContainerTitle">
                  Price per
                </div>
                <div className="shoppingCartItemSubContainerNumber">
                  {formatNumber(item.price)} Pokecoins
                </div>
              </div>
              <div className="shoppingCartItemSubContainer">
                <div className="shoppingCartItemSubContainerTitle">
                  Item sub total
                </div>
                <div className="shoppingCartItemSubContainerNumber">
                  {formatNumber(itemTotal)} PokeCoins
                </div>
              </div>
              <button
                className="shoppingCartItemRemoveBtn"
                onClick={() => {
                  removeFromCart(item.id, itemTotal, true);
                }}
              >
                Remove Item
              </button>
            </div>
          );
        })}
      </div>
      <div className="shoppingCartCumulativeTotals">
        <div className="shoppingCartCumulativeTotalsContainers">
          <div className="shoppingCartCumulativeTotalsTitles">Sub Total </div>{" "}
          <div className="shoppingCartCumulativeTotalsNumbers">
            {formatNumber(runningTotal)} PokeCoins
          </div>
        </div>
        <div className="shoppingCartCumulativeTotalsContainers">
          <div className="shoppingCartCumulativeTotalsTitles">
            Sinnoh Provincal Tax
          </div>
          <div className="shoppingCartCumulativeTotalsNumbers">
            {formatNumber(Math.round(runningTotal * 0.13 * 100) / 100)}{" "}
            PokeCoins
          </div>
        </div>
        <div className="shoppingCartCumulativeTotalsContainers">
          <div className="shoppingCartCumulativeTotalsTitles">Grand Total</div>
          <div className="shoppingCartCumulativeTotalsNumbers">
            {formatNumber(Math.round(runningTotal * 1.13 * 100) / 100)}{" "}
            PokeCoins
          </div>
        </div>
      </div>
    </div>
  );
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export default ShoppingCart;
