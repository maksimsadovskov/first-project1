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

  const MOVIES_PER_PAGE = 15; // 5 постеров в ряду × 3 ряда = 15 фильмов

  useEffect(() => {
    if (genreId) {
      console.log('Загрузка фильмов для жанра ID:', genreId);
      // Очищаем фильмы перед загрузкой
      setCurrentPage(1);
      setHasMoreMovies(true);
      
      dispatch(fetchMoviesByGenre({ 
        genreId: parseInt(genreId), 
        page: 1, 
        limit: MOVIES_PER_PAGE 
      })).then((result) => {
        if (result.type === 'movies/fetchMoviesByGenre/fulfilled') {
          const response = result.payload as any;
          if (response && response.movies) {
            console.log('Загружено фильмов:', response.movies.length);
            if (response.movies.length < MOVIES_PER_PAGE) {
              setHasMoreMovies(false);
            } else {
              setHasMoreMovies(true);
            }
          }
        } else if (result.type === 'movies/fetchMoviesByGenre/rejected') {
          console.error('Ошибка загрузки фильмов:', result);
          setHasMoreMovies(false);
        }
      });
    }
  }, [genreId, dispatch]);

  const loadMoreMovies = (): void => {
    if (!genreId || loadingMore || !hasMoreMovies) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    // Загружаем следующую страницу, которая заменит текущие фильмы
    dispatch(fetchMoviesByGenre({ 
      genreId: parseInt(genreId), 
      page: nextPage, 
      limit: MOVIES_PER_PAGE 
    })).then((result) => {
      if (result.payload && typeof result.payload === 'object' && result.payload !== null && 'movies' in result.payload) {
        const response = result.payload as any;
        console.log('Загружено фильмов для страницы', nextPage, ':', response.movies.length);
        if (response.movies.length < MOVIES_PER_PAGE) {
          setHasMoreMovies(false);
        }
        setCurrentPage(nextPage);
      } else if (result.type === 'movies/fetchMoviesByGenre/rejected') {
        console.error('Ошибка загрузки фильмов:', result);
        setHasMoreMovies(false);
      }
      setLoadingMore(false);
    }).catch(() => {
      setLoadingMore(false);
      setHasMoreMovies(false);
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
                <MovieCard key={movie.id} movie={movie} size="small" />
              ))}
            </div>

            {hasMoreMovies && movies.length >= 15 && (
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
