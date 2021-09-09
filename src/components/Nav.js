import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context";

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
      <ul className="navLinks">
        <Link to="/" style={{ textDecoration: "none" }}>
          <li>Home</li>
        </Link>
        <Link to="/shopMain" style={{ textDecoration: "none" }}>
          <li>Shop Main</li>
        </Link>
        <Link to="/shoppingCart" style={{ textDecoration: "none" }}>
          <li>
            Cart: <div id="navShoppingCartNumber">{shoppingCart.length}</div>
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
