import Authorized from "./auth/Authorized";
import Button from "./utils/Button";
import {logout} from "./auth/handleJWT";
import {useContext} from "react";
import AuthenticationContext from "./auth/AuthenticationContext";

export default function Menu() {

    const {update, claims} = useContext(AuthenticationContext);

    function getUserEmail(): string{
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

                        <Authorized
                            role={'admin'}
                            authorized={<>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/genres">
                                        Genres
                                    </a>
                                </li>
                                <li className={"nav-item"}>
                                    <a className={"nav-link"} href="/actors">
                                        Actors
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
                            </>}
                        />
                    </ul>

                    <div className={"d-flex"}>
                        <Authorized
                            authorized={
                            <>
                                <span className={"nav-link"}>Hello, {getUserEmail()}</span>
                                <Button
                                    onClick={() => {
                                        logout();
                                        update([]);
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