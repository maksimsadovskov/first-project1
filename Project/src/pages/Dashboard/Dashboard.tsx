import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRandomMovie, fetchTopMovies, addToFavorites, removeFromFavorites } from '../../store/slices/moviesSlice';
import { openAuthModal, openTrailerModal } from '../../store/slices/modalSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredMovie, topMovies, isLoading, favorites } = useAppSelector((state) => state.movies);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchRandomMovie());
    dispatch(fetchTopMovies());
  }, [dispatch]);

  const handleGetNewMovie = (): void => {
    dispatch(fetchRandomMovie());
  };

  const handleTrailerClick = (): void => {
    if (featuredMovie) {
      dispatch(openTrailerModal(featuredMovie.trailer));
    }
  };

  const handleFavoriteClick = (): void => {
    if (!featuredMovie) return;
    
    if (!isAuthenticated) {
      dispatch(openAuthModal());
      return;
    }

    const isFavorite = favorites.some(fav => fav.id === featuredMovie.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(featuredMovie.id));
    } else {
      dispatch(addToFavorites(featuredMovie.id));
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

  console.log('Dashboard render:', { featuredMovie, topMovies, isLoading });

  return (
    <div className="dashboard">
      <div className="container">
        {/* Featured Movie Section */}
        {featuredMovie && (
          <section className="featured-movie">
            <div className="featured-movie__content">
              <div className="featured-movie__poster">
                <img src={featuredMovie.poster} alt={featuredMovie.title} />
              </div>
              <div className="featured-movie__info">
                <h1 className="featured-movie__title">{featuredMovie.title}</h1>
                <p className="featured-movie__description">
                  {featuredMovie.description}
                </p>
                <div className="featured-movie__details">
                  <div className="detail-item">
                    <span className="detail-value detail-value--rating">★{featuredMovie.rating}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-value">{featuredMovie.year}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-value">{featuredMovie.genre}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-value">1 ч 7 мин</span>
                  </div>
                </div>
                <div className="featured-movie__actions-container">
                  <button className="btn btn--primary" onClick={handleTrailerClick}>
                    Трейлер
                  </button>
                  <Link to={`/movie/${featuredMovie.id}`} className="btn btn--secondary">
                    О фильме
                  </Link>
                  <button 
                    className={`action-btn action-btn--favorite ${favorites.some(fav => fav.id === featuredMovie.id) ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label="Добавить в избранное"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button 
                    className="action-btn action-btn--refresh"
                    onClick={handleGetNewMovie}
                    aria-label="Получить новый фильм"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                    </svg>
                  </button>
                  
                  {/* Мобильная версия */}
                  <div className="mobile-second-row">
                    <Link to={`/movie/${featuredMovie.id}`} className="btn btn--secondary">
                      О фильме
                    </Link>
                    <button 
                      className={`action-btn action-btn--favorite ${favorites.some(fav => fav.id === featuredMovie.id) ? 'active' : ''}`}
                      onClick={handleFavoriteClick}
                      aria-label="Добавить в избранное"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn action-btn--refresh"
                      onClick={handleGetNewMovie}
                      aria-label="Получить новый фильм"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Top 10 Movies Section */}
        <section className="top-movies">
          <h2 className="section-title">Топ 10 фильмов</h2>
          <div className="top-movies__grid">
            {topMovies.map((movie, index) => (
              <div key={movie.id} className="top-movie-item">
                <div className="top-movie-item__rank">
                  {index + 1}
                </div>
                <MovieCard movie={movie} size="small" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
