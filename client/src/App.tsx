import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Menu from "./Menu";
import routes from "./routing-config";
import IndividualMovie from "./movies/IndividualMovie";
import {movieDTO} from "./movies/movies.model";

function App() {
    const testMovie: movieDTO = {
        id: 1,
        title: 'Spider-Man: Far From Home',
        poster: 'https://upload.wikimedia.org/wikipedia/en/b/bd/Spider-Man_Far_From_Home_poster.jpg'
    }
  return (
      <>
      <BrowserRouter>
        <Menu/>
        <div className={'container'}>
          <Switch>
            {routes.map(route =>
                <Route key={route.path} path={route.path} exact={route.exact}>
                  <route.component/>
                </Route>
            )}
          </Switch>
        </div>
      </BrowserRouter>

      <IndividualMovie {...testMovie}/>
    </>
  );
}

export default App;
