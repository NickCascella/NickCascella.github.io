import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <ul>
        <Link to="./">
          <li>Home</li>
        </Link>
        <Link to="./shopMain">
          <li>Shop Main</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
