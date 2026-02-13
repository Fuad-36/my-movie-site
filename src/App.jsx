import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import Pagination from "./components/Pagination.jsx";

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
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  const loadTrendingMovies = async () => {
    try {
      const result = await getTrendingMovies();

      setTrendingMovies(result);
    } catch (error) {
      console.log(`Error in fetching trending movies ${error}`);
    }
  };

  const fetchMovies = async (query = "", page = 1, signal = null) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_URL}search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${API_URL}discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, { ...API_OPTIONS, signal });
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      const {
        page: returnedPage,
        results = [],
        total_pages = 1,
        total_results = 0,
      } = data;

      const API_PAGE_CAP = 500;
      setMovieList(results);
      setPageNumber(returnedPage || page);
      setTotalResults(total_results || 0);
      setTotalPages(Math.min(total_pages || 1, API_PAGE_CAP));

      if (query && returnedPage === 1 && results.length > 0) {
        await updateSearchCount(query, results[0]);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      console.error("Error in fetching movies", error);
      setErrorMessage("Error in fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    
    fetchMovies(debouncedSearchTerm, pageNumber, signal);

    
    return () => controller.abort();
  }, [debouncedSearchTerm, pageNumber]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedSearchTerm]);

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
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
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
        <section className='mt-7'>
          <Pagination
            page={pageNumber}
            totalItems={totalResults > totalPages*20? totalPages*20 : totalResults}
            totalPages={totalPages}
            perPage={20}
            onPageChange={(newPage) => setPageNumber(newPage)}
          />
        </section>
      </div>
    </main>
  );
};

export default App;
