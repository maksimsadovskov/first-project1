import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { store } from '../../store';
import { fetchMoviesByGenre, addMoreMovies, clearMovies } from '../../store/slices/moviesSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import './GenrePage.css';

const GenrePage: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movies, genres, isLoading } = useAppSelector((state) => state.movies);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMoreMovies, setHasMoreMovies] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false);

  const INITIAL_MOVIES_COUNT = 15;
  const LOAD_MORE_COUNT = 10;

  useEffect(() => {
    if (!genreId) return;
    const parsedGenreId = parseInt(genreId);
    setIsInitialLoading(true);
    setHasMoreMovies(true);
    setCurrentPage(1);
    dispatch(clearMovies());
    dispatch(fetchMoviesByGenre({ genreId: parsedGenreId, page: 1, limit: INITIAL_MOVIES_COUNT }))
      .then((result) => {
        if (result.type === 'movies/fetchMoviesByGenre/fulfilled') {
          const response = result.payload as any;
          const total = (response && typeof response.total === 'number') ? response.total : 0;
          const state = store.getState();
          const count = state.movies.movies.length;
          setHasMoreMovies(total > count);
        } else {
          setHasMoreMovies(false);
        }
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  }, [genreId, dispatch]);
  
  const loadMoreMovies = (): void => {
    if (!genreId || loadingMore || !hasMoreMovies) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    // Загружаем следующую страницу, которая заменит текущие фильмы
    dispatch(fetchMoviesByGenre({ 
      genreId: parseInt(genreId), 
      page: nextPage, 
      limit: LOAD_MORE_COUNT 
    })).then((result) => {
        if (result.payload && typeof result.payload === 'object' && result.payload !== null && 'movies' in result.payload) {
          const response = result.payload as any;
          const total = response && typeof response.total === 'number' ? response.total : 0;
          const state = store.getState();
          const newCount = state.movies.movies.length;
          setHasMoreMovies(total > 0 && newCount < total);
          setCurrentPage(nextPage);
        } else if (result.type === 'movies/fetchMoviesByGenre/rejected') {
          setHasMoreMovies(false);
        }
      setLoadingMore(false);
    }).catch(() => {
      setLoadingMore(false);
      setHasMoreMovies(false);
    });
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  if (isInitialLoading && movies.length === 0) {
    return (
      <div className="genre-page-loading">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

  const genre = genres.find(g => g.id === parseInt(genreId || '0')) || 
                (genreId ? { id: parseInt(genreId), name: `Жанр ${genreId}`, slug: '', image: '' } : null);

  if (!genre) {
    return (
      <div className="genre-page-error">
        <h1>Жанр не найден</h1>
        <p>Запрашиваемый жанр не существует.</p>
      </div>
    );
  }

  return (
    <div className="genre-page">
      <div className="container">
        <div className="genre-header">
          <button className="genre-back-btn" onClick={handleGoBack}>
            <span className="back-arrow" aria-hidden="true">
              <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.714 10.6066L12.9637 18.8561L10.6067 21.2131L0 10.6066L10.6067 0L12.9637 2.35702L4.714 10.6066Z" fill="white"/>
              </svg>
            </span>
            <span className="genre-title">{genre.name}</span>
          </button>
        </div>

        {movies.length === 0 ? (
          <div className="no-movies">
            <h2>Фильмы не найдены</h2>
            <p>В данном жанре пока нет доступных фильмов.</p>
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.slice(0, currentPage === 1 ? INITIAL_MOVIES_COUNT : movies.length).map(movie => (
                <MovieCard key={movie.id} movie={movie} size="small" />
              ))}
            </div>

            {hasMoreMovies && movies.length >= INITIAL_MOVIES_COUNT && !isInitialLoading && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={loadMoreMovies}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Загрузка...' : 'Показать еще'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
