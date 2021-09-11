import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context";
import styled from "styled-components";

const Nav = () => {
  const { shoppingCart } = useContext(GlobalContext);

  const shoppingCartDisplay = () => {
    let reading = document.getElementById("navShoppingCartNumber");

    if (shoppingCart.length < 1) {
      reading.style.display = "none";
    } else {
      reading.style.display = "inline";
    }
  };

  useEffect(() => {
    shoppingCartDisplay();
  }, [shoppingCart]);

  return (
    <nav>
      <ul className="navLinkContainer">
        <Link to="/" style={{ textDecoration: "none" }}>
          <li className="navLinks">Home</li>
        </Link>
        <Link to="/shopMain" style={{ textDecoration: "none" }}>
          <li className="navLinks">Store</li>
        </Link>
        <Link to="/shoppingCart" style={{ textDecoration: "none" }}>
          <li className="navLinks">Cart</li>
        </Link>
        <div id="navShoppingCartNumber">{shoppingCart.length}</div>
      </ul>
    </nav>
  );
};

export default Nav;
