import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Menu from "./Menu";
import routes from "./routing-config";
import configureValidation from "./Validation";
import {claim} from "./auth/auth.models";
import AuthenticationContext from "./auth/AuthenticationContext";
import LandingPage from "./movies/LandingPage";
import {getClaims} from "./auth/handleJWT";

configureValidation();

function App() {

    const [claims, setClaims] =
        useState<claim[]>([]);

    useEffect(() => {
        setClaims(getClaims());
    }, []);

    function isAdmin(){
        return claims.findIndex(claim => claim.name === 'role' && claim.value === 'admin') > -1;
    }

    return (
        <>
            <BrowserRouter>
                <AuthenticationContext.Provider value={{claims, update: setClaims}}>
                    <Menu/>
                    <div className={'container'}>
                        <Switch>
                            {routes.map(route =>
                                <Route key={route.path} path={route.path} exact={route.exact}>
                                    {route.isAdmin && !isAdmin() ?
                                    <LandingPage/> :
                                    <route.component/>
                                    }
                                </Route>
                            )}
                        </Switch>
                    </div>
                    <link rel="stylesheet"
                          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <footer className="bd-footer py-5 mt-5 bg-light">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                                    <h3 className="footer-heading">About Us</h3>
                                    <p>A website dedicated to bringing you the latest news, reviews, trailers, and more
                                        from
                                        the world of movies.</p>
                                </div>
                                <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                                    <h3 className="footer-heading">Connect With Us</h3>
                                    <table className={"icons"}>
                                        <thead>
                                        <tr>
                                            <td><i className="fa fa-facebook mr-2"></i></td>
                                            <td><i className="fa fa-twitter mr-2"></i></td>
                                            <td><i className="fa fa-instagram mr-2"></i></td>
                                        </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                                    <h3 className="footer-heading">Contact Us</h3>
                                    <ul className="list-unstyled">
                                        <li><a href="mailto:contact@movieswebpage.com">contact@movieswebpage.com</a>
                                        </li>
                                        <li><a href="tel:+1-123-456-7890">+1 (123) 456-7890</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <p className="mb-0">
                                        &copy; 2023 MoviesWebPage. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </AuthenticationContext.Provider>
            </BrowserRouter>
        </>
    );
}

export default App;
