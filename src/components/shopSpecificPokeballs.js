import react, { useState, useEffect } from "react";

const ShopSpecificPokeballs = ({ match }) => {
  const [specificPokeball, setSpecificPokeball] = useState();

  useEffect(() => {
    getPokeballsData();
  }, []);

  let getPokeballsData = async () => {
    const pokeballsData = await fetch(
      `https://pokeapi.co/api/v2/item/${match.params.id}`
    );
    const pokeballsInfo = await pokeballsData.json();
    console.log(pokeballsInfo);
    setSpecificPokeball(pokeballsInfo);
  };

  if (!specificPokeball) {
    return <div>Loading...</div>;
  }

  const checkPrice = () => {
    let price = specificPokeball.cost;
    return price > 0 ? price : "Currently Out of Stock";
  };

  const changeQuantity = () => {};

  return (
    <div className="specificPokeballScreen">
      <div className="specificPokeballCard">
        <div className="specificPokeballCardLeftSide">
          <div className="specificPokeballCardName">
            {capitalizeFirstLetter(specificPokeball.name)}
          </div>
          <img
            className="specificPokeballCardImage"
            src={specificPokeball.sprites.default}
          ></img>
          <form
            onSubmit={(e) => {
              //   addToCart(
              //     e,
              //     capitalizeFirstLetter(specificPokeball.name),
              //     pokemonQuantity,
              //     pokemonCapturePrice
              //   );
            }}
          >
            <div>
              <button
                onClick={(e) => {
                  changeQuantity(e, true, false);
                }}
              >
                -
              </button>
              <input
                // value={pokemonQuantity}
                type="number"
                required
                onChange={(e) => {
                  changeQuantity(e, false);
                }}
              ></input>
              <button
                onClick={(e) => {
                  changeQuantity(e, true, true);
                }}
              >
                +
              </button>
            </div>
          </form>
        </div>
        <div className="specificPokeballCardRightSide">
          <div className="specificPokeballSubheading">Category</div>
          <div className="specificPokeballTextData">
            {capitalizeFirstLetter(specificPokeball.category.name)}
          </div>
          <div className="specificPokeballSubheading">Effect Entry</div>
          <div className="specificPokeballTextData">
            {specificPokeball.effect_entries[0].effect}
          </div>
          <div className="specificPokeballSubheading">Our humble opinion</div>
          <div className="specificPokeballTextData">
            {specificPokeball.flavor_text_entries[2].text}
          </div>
          <div className="specificPokeballSubheading">Price per</div>
          <div className="specificPokeballTextData">{checkPrice()}</div>
        </div>
      </div>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ShopSpecificPokeballs;
