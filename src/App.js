import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ShopMain from "./components/shopMain";
import ShopPokemon from "./components/shopPokemon";

function App() {
  return (
    <div>
      <Router>
        <div className="organize">
          <Nav />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/shopMain" component={ShopMain} />
            <Route path="/shopPokemon" component={ShopPokemon} />
            {/* <Route exact path="/shop" component={Shop} />
            <Route path="/shop/:itemId" component={ItemDetail} /> */}
          </Switch>
        </div>
      </Router>
    </div>
  );
}

let HomePage = () => {
  return <div>Welcome to the one stop Pokemon Shop</div>;
};

export default App;
