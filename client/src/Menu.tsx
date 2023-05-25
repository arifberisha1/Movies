import Authorized from "./auth/Authorized";
import Button from "./utils/Button";
import {logout} from "./auth/handleJWT";
import {useContext} from "react";
import AuthenticationContext from "./auth/AuthenticationContext";
import {useHistory} from "react-router-dom";

export default function Menu() {

    const {update, claims} = useContext(AuthenticationContext);
    const history = useHistory();

    function getUserEmail(): string {
        return claims.filter(x => x.name === 'email')[0]?.value;
    }

    return (
        <nav className={'navbar navbar-expand-lg navbar-light bg-light'}>
            <div className={"container-fluid"}>
                <a className={"navbar-brand"} href="/">Home</a>
                <div className={"collapse navbar-collapse"}
                     style={{display: 'flex', justifyContent: 'space-between'}}>
                    <ul className={"navbar-nav me-auto mb-2 mb-lg-0"}>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="/movies/filter">
                                Filter Movies
                            </a>
                        </li>
                        {claims.length > 0 ?
                            <>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/movies/topRated">
                                        Top-Rated
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/movies/favourite">
                                        Favourite
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/actors">
                                        Actors
                                    </a>
                                </li>
                            </>
                            : null
                        }

                        <Authorized
                            role={'admin'}
                            authorized={<>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/genres">
                                        Genres
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/movietheaters">
                                        Movie Theaters
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/movies/create">
                                        Create Movie
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/users">
                                        Users
                                    </a>
                                </li>
                            </>}
                        />
                    </ul>

                    <div className={"d-flex"}>
                        <Authorized
                            authorized={
                                <>
                                    <span className={"nav-link"}>Hello, {getUserEmail()}</span>
                                    <a href="/profile" className={"nav-link btn btn-link"}>Profile</a>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            update([]);
                                            history.push('/');
                                            window.location.reload();
                                        }}
                                        className={"nav-link btn btn-link"}
                                    >Logout</Button>
                                </>
                            }
                            notAuthorized={
                                <>
                                    <a href="/register" className={"nav-link btn btn-link"}>
                                        Register</a>
                                    <a href="/login" className={"nav-link btn btn-link"}>
                                        Login</a>
                                </>}
                        />
                    </div>

                </div>
            </div>
        </nav>
    );
}