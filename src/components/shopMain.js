import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ShopMain = () => {
  return (
    <div>
      <Link to="./shopPokemon">
        <li>Pokemon</li>
      </Link>
      <Link to="./shopPokeballs" style={{ textDecoration: "none" }}>
        <li>Pokeballs and Extras</li>
      </Link>
    </div>
  );
};

export default ShopMain;
