import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import configureValidation from "./Validation";
import {claim} from "./auth/auth.models";
import AuthenticationContext from "./auth/AuthenticationContext";
import {getClaims} from "./auth/handleJWT";
import configureInterceptor from "./utils/httpInterceptors";
import Routing from "./Routing";

configureValidation();
configureInterceptor();

function App() {

    const [claims, setClaims] =
        useState<claim[]>([]);
    useEffect(() => {
        setClaims(getClaims());
    }, []);

    function isAdmin() {
        var admin = false;
        claims.map(claim => {
            if (claim.name === 'role' && claim.value === 'admin') {
                admin = true;
            }
        });
        return admin;
    }


    return (
        <div className={"body"}>
            <BrowserRouter>
                <AuthenticationContext.Provider value={{claims, update: setClaims}}>
                    {/*<Menu/>*/}
                    <Routing isAdmin={isAdmin()}/>
                    <br/>
                    <br/>
                    <link rel="stylesheet"
                          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <footer className="bd-footer py-5 mt-auto bg-light">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                                    <h3 className="footer-heading">About Us</h3>
                                    <p>A website dedicated to bringing you the latest news, reviews, trailers, and
                                        more
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
        </div>
    );
}

export default App;
