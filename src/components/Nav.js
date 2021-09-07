import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
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
          <li>Cart</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
