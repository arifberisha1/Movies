import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Menu from "./Menu";
import routes from "./routing-config";
import {landingPageDTO} from "./movies/movies.model";
import MoviesList from "./movies/MoviesList";

function App() {

    const [movies, setMovies]= useState<landingPageDTO>({});

    useEffect(() => {
        const timerId= setTimeout(()=>{
            setMovies({
                inTheaters: [{
                    id: 1,
                    title: 'Spider-Man: Far From Home',
                    poster: 'https://upload.wikimedia.org/wikipedia/en/b/bd/Spider-Man_Far_From_Home_poster.jpg'
                }, {
                    id: 2,
                    title: 'Luca',
                    poster: 'https://m.media-amazon.com/images/M/MV5BZTQyNTU0MDktYTFkYi00ZjNhLWE2ODctMzBkM2U1ZTk3YTMzXkEyXkFqcGdeQXVyNTI4MzE4MDU@._V1_.jpg'
                },{
                    id: 3,
                    title: 'Alice in Wonderland',
                    poster: 'https://m.media-amazon.com/images/M/MV5BMTMwNjAxMTc0Nl5BMl5BanBnXkFtZTcwODc3ODk5Mg@@._V1_.jpg'
                },{
                    id: 4,
                    title: 'Super-Man',
                    poster: 'https://i.ebayimg.com/images/g/IYMAAOSwffFi4JvF/s-l1600.jpg'
                },{
                    id: 5,
                    title: 'Tom&Jerry',
                    poster: 'https://www.themoviedb.org/t/p/original/8XZI9QZ7Pm3fVkigWJPbrXCMzjq.jpg'
                },
                ],
                upcomingReleases: [
                    {
                        id: 6,
                        title: 'Soul',
                        poster: 'https://i.redd.it/tig65f19aav51.jpg'
                    },
                    {
                        id: 7,
                        title: 'Rapunzel',
                        poster: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6b96bbf4-a476-4049-b5a1-98d2a4ca4152/d5eo2qj-df9ce16c-8eaf-4aaf-9f44-55c3adb12785.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZiOTZiYmY0LWE0NzYtNDA0OS1iNWExLTk4ZDJhNGNhNDE1MlwvZDVlbzJxai1kZjljZTE2Yy04ZWFmLTRhYWYtOWY0NC01NWMzYWRiMTI3ODUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.N7WIWQmoTHYwF70YWLtNknnbOvbZ3pQS265P-nRUy_k'
                    }
                ]
            })
        }, 1000);

        return () =>clearTimeout(timerId);
    })
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


      <div className="container">
      <h3>In Theaters</h3>
          <MoviesList movies={movies.inTheaters}/>
          
      <h3>Upcoming Releases</h3>
      <MoviesList movies={movies.upcomingReleases}/>
      </div>
    </>
  );
}

export default App;
