import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ShopMain = () => {
  return (
    <div>
      <Link to="./shopPokemon">
        <li>Pokemon</li>
      </Link>
    </div>
  );
};

export default ShopMain;
