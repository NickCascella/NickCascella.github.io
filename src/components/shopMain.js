import { Link } from "react-router-dom";

const ShopMain = () => {
  return (
    <div id="shopMainScreen">
      <Link to="./shopPokemon">
        <div className="shopMainImgPokemon"></div>
      </Link>
      <Link to="./shopPokeballs" style={{ textDecoration: "none" }}>
        <div className="shopMainImgItems"></div>
      </Link>
    </div>
  );
};

export default ShopMain;
