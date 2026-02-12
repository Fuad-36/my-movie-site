import React, { useEffect, useState } from "react";
import {useDebounce} from "react-use";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(()=>setDebouncedSearchTerm(searchTerm),700,[searchTerm]);

  const loadTrendingMovies = async()=>{
    try{
      const result= await getTrendingMovies();
      console.log(result);
      setTrendingMovies(result);
      console.log(trendingMovies);
    }catch(error){
      console.log(`Error in fetching trending movies ${error}`);
    }
  }

  const fetchMovies = async (query='') => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_URL}search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if(query && data.results.length>0){
        await updateSearchCount(query,data.results[0]);
      }

    } catch (error) {
      console.log(`Error in fetching movies ${error}`);
      setErrorMessage("Error in fetching movies");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies()
  },[])

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find The <span className="text-gradient">Movies</span> That You Love
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length>0 &&(

          <section className="trending">
            <h2>Trending</h2>
            <ul>
              {trendingMovies.map((movie,index)=>(
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
          
        
        <section className="all-movies">
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">Error in showing movies</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
