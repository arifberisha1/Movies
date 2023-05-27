import Authorized from "./auth/Authorized";
import Button from "./utils/Button";
import {logout} from "./auth/handleJWT";
import {useContext} from "react";
import AuthenticationContext from "./auth/AuthenticationContext";
import {Link, NavLink, useNavigate} from "react-router-dom";

export default function Menu() {

    const {update, claims} = useContext(AuthenticationContext);
    const navigate = useNavigate();

    function getUserEmail(): string {
        return claims.filter(x => x.name === 'email')[0]?.value;
    }

    return (
        <nav className={'navbar navbar-expand-lg navbar-light bg-light'}>
            <div className={"container-fluid"}>
                <Link className={"navbar-brand"} to="/">Home</Link>
                <div className={"collapse navbar-collapse"}
                     style={{display: 'flex', justifyContent: 'space-between'}}>
                    <ul className={"navbar-nav me-auto mb-2 mb-lg-0"}>
                        <li className={"nav-item"}>
                            <NavLink className={"nav-link"} to="/movies/filter">
                                Filter Movies
                            </NavLink>
                        </li>
                        {claims.length > 0 ?
                            <>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/movies/topRated">
                                        Top-Rated
                                    </NavLink>
                                </li>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/movies/favourite">
                                        Favourites
                                    </NavLink>
                                </li>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/movies/watched">
                                        Watched
                                    </NavLink>
                                </li>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/actors">
                                        Actors
                                    </NavLink>
                                </li>
                            </>
                            : null
                        }

                        <Authorized
                            role={'admin'}
                            authorized={<>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/genres">
                                        Genres
                                    </NavLink>
                                </li>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/movietheaters">
                                        Movie Theaters
                                    </NavLink>
                                </li>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/movies/create">
                                        Create Movie
                                    </NavLink>
                                </li>
                                <li className={"nav-item"}>
                                    <NavLink className={"nav-link"} to="/users">
                                        Users
                                    </NavLink>
                                </li>
                            </>}
                        />
                    </ul>

                    <div className={"d-flex"}>
                        <Authorized
                            authorized={
                                <>
                                    <span className={"nav-link"}>Hello, {getUserEmail()}</span>
                                    <NavLink to="/profile" className={"nav-link btn btn-link"}>Profile</NavLink>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            update([]);
                                            navigate('/');
                                        }}
                                        className={"nav-link btn btn-link"}
                                    >Logout</Button>
                                </>
                            }
                            notAuthorized={
                                <>
                                    <NavLink to="/register" className={"nav-link btn btn-link"}>
                                        Register</NavLink>
                                    <NavLink to="/login" className={"nav-link btn btn-link"}>
                                        Login</NavLink>
                                </>}
                        />
                    </div>

                </div>
            </div>
        </nav>
    );
}