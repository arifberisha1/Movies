import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Menu from "./Menu";
import routes from "./routing-config";

function App() {

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
        </>
    );
}

export default App;
