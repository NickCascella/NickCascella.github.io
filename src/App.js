import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { GlobalContext } from "./Context";
import Nav from "./components/Nav";
import ShoppingCart from "./components/shoppingCart";
import ShopMain from "./components/shopMain";
import ShopPokemon from "./components/shopPokemon";
import ShopPokemonIndvidually from "./components/shopPokemonIndividually";
import ShopPokeballs from "./components/shopPokeballs";
import ShopSpecificPokeballs from "./components/shopSpecificPokeballs";
import HomePage from "./components/Home";

function App() {
  const [shoppingCart, setShoppingCart] = useState([]);

  return (
    <GlobalContext.Provider
      value={{
        shoppingCart,
        setShoppingCart,
        LoadingScreen,
      }}
    >
      <Router>
        <div className="organize">
          <Nav />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/shoppingCart" component={ShoppingCart} />
            <Route path="/shopMain" component={ShopMain} />
            <Route exact path="/shopPokemon" component={ShopPokemon} />
            <Route path="/shopPokemon/:id" component={ShopPokemonIndvidually} />
            <Route exact path="/shopPokeballs" component={ShopPokeballs} />
            <Route
              path="/shopPokeballs/:id"
              component={ShopSpecificPokeballs}
            />
          </Switch>
        </div>
      </Router>
    </GlobalContext.Provider>
  );
}

const LoadingScreen = () => {
  return (
    <div id="loadingContainer">
      <div className="spinner-4"></div>
    </div>
  );
};

export default App;
