import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMoviesByGenre, addMoreMovies } from '../../store/slices/moviesSlice';
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

  const MOVIES_PER_PAGE = 10;

  useEffect(() => {
    if (genreId) {
      dispatch(fetchMoviesByGenre({ 
        genreId: parseInt(genreId), 
        page: 1, 
        limit: MOVIES_PER_PAGE 
      }));
      setCurrentPage(1);
      setHasMoreMovies(true);
    }
  }, [genreId, dispatch]);

  const loadMoreMovies = (): void => {
    if (!genreId || loadingMore || !hasMoreMovies) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    dispatch(fetchMoviesByGenre({ 
      genreId: parseInt(genreId), 
      page: nextPage, 
      limit: MOVIES_PER_PAGE 
    })).then((result) => {
      if (result.payload && typeof result.payload === 'object' && result.payload !== null && 'movies' in result.payload) {
        const response = result.payload as any;
        if (response.movies.length < MOVIES_PER_PAGE) {
          setHasMoreMovies(false);
        }
        dispatch(addMoreMovies(response.movies));
        setCurrentPage(nextPage);
      }
      setLoadingMore(false);
    }).catch(() => {
      setLoadingMore(false);
    });
  };

  const genre = genres.find(g => g.id === parseInt(genreId || '0'));

  const handleGoBack = (): void => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  if (isLoading && movies.length === 0) {
    return (
      <div className="genre-page-loading">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

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
            <span className="back-arrow">←</span>
            <span className="genre-title">{genre.name}</span>
          </button>
          <p className="genre-description">
            Лучшие фильмы в жанре "{genre.name}". Всего найдено: {movies.length} фильмов.
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="no-movies">
            <h2>Фильмы не найдены</h2>
            <p>В данном жанре пока нет доступных фильмов.</p>
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {hasMoreMovies && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={loadMoreMovies}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Загрузка...' : 'Загрузить еще'}
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
