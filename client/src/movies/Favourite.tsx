import MoviesList from "./MoviesList";
import { favouriteMovieDetailsDTO } from "./movies.model";
import { useContext, useEffect, useState } from "react";
import AuthenticationContext from "../auth/AuthenticationContext";
import axios, { AxiosResponse } from "axios";
import { urlFavourite } from "../endpoints";
import { useNavigate } from "react-router-dom";

export default function Favourite() {
  const [errors, setErrors] = useState<string[]>([]);
  const [movies, setMovies] = useState<favouriteMovieDetailsDTO[]>([]);
  const { claims } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  useEffect(() => {
    claims.map((claim) => {
      if (claim.name === "email") {
        getMovies(claim.value);
      }
    });
  }, [claims]);

  async function getMovies(email: string) {
    console.log("Email: " + email);
    setErrors([]);
    try {
      await axios
        .get(`${urlFavourite}/getByUserEmail/${email}`)
        .then((response: AxiosResponse<favouriteMovieDetailsDTO[]>) => {
          setMovies(response.data);
        });
    } catch (error) {
      // @ts-ignore
      setErrors(error.response.data);
      console.log(errors);
    }
  }

  return (
    <>
      <h3>Favourites Movies</h3>
      <br />
      <MoviesList movies={movies} />
    </>
  );
}
