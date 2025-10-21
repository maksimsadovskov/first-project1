import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openAuthModal, openTrailerModal } from '../../store/slices/modalSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/moviesSlice';
import AuthModal from '../../components/AuthModal/AuthModal';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import './MoviePage.css';

const MoviePage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.movies);
  const { isAuthModalOpen, isTrailerModalOpen, trailerUrl } = useAppSelector((state) => state.modal);
  
  const { movies } = useAppSelector((state) => state.movies);
  const [movie, setMovie] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    if (movieId) {
      // Ищем фильм в списке всех фильмов
      const foundMovie = movies.find(m => m.id === parseInt(movieId));
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        // Если фильм не найден в списке, используем моковые данные
        const mockMovie = {
          id: parseInt(movieId),
          title: 'Шерлок Холмс и доктор Ватсон: Знакомство',
          year: 2023,
          country: 'Россия',
          director: 'Иван Иванов',
          actors: ['Алексей Иванов', 'Петр Петров'],
          rating: 8.5,
          budget: '250 000 руб.',
          boxOffice: '1 000 000 руб.',
          genre: 'Детектив',
          poster: 'https://via.placeholder.com/400x600/2a2a2a/ffffff?text=Movie',
          trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        };
        setMovie(mockMovie);
      }
    }
  }, [movieId, movies]);

  useEffect(() => {
    if (movie) {
      setIsFavorited(favorites.some(fav => fav.id === movie.id));
    }
  }, [movie, favorites]);

  const handleFavoriteClick = (): void => {
    if (!movie) return;
    
    if (!isAuthenticated) {
      dispatch(openAuthModal());
      return;
    }

    if (isFavorited) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie.id));
    }
    
    setIsFavorited(!isFavorited);
  };

  const handleTrailerClick = (): void => {
    if (movie) {
      dispatch(openTrailerModal(movie.trailer));
    }
  };

  if (!movie) {
    return (
      <div className="movie-page-error">
        <h1>Фильм не найден</h1>
        <p>Запрашиваемый фильм не существует.</p>
      </div>
    );
  }

  return (
    <div className="movie-page">
      <div className="container">
        <div className="movie-content">
          <div className="movie-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>
          
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            
            {/* Десктопная версия - все в одну линию */}
            <div className="movie-desktop-layout">
              <div className="movie-desktop-buttons">
                <button 
                  className="btn btn--primary btn-trailer"
                  onClick={handleTrailerClick}
                >
                  Смотреть трейлер
                </button>
                
                <button 
                  className={`btn btn--icon ${isFavorited ? 'btn--favorited' : ''}`}
                  onClick={handleFavoriteClick}
                  title={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                  <span className="icon-heart">{isFavorited ? '❤️' : '🤍'}</span>
                </button>
              </div>
              
              <div className="movie-details">
                <h2 className="details-title">О фильме</h2>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Год:</span>
                    <span className="detail-value">{movie.year}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Страна:</span>
                    <span className="detail-value">{movie.country}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Режиссер:</span>
                    <span className="detail-value">{movie.director}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Актеры:</span>
                    <span className="detail-value">{movie.actors.join(', ')}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Рейтинг:</span>
                    <span className="detail-value rating">★ {movie.rating}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Жанр:</span>
                    <span className="detail-value">{movie.genre}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Бюджет:</span>
                    <span className="detail-value">{movie.budget}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Сборы:</span>
                    <span className="detail-value">{movie.boxOffice}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Мобильная версия */}
            <div className="movie-mobile-layout">
              <div className="movie-mobile-buttons">
                <button 
                  className="btn btn--primary btn-trailer-mobile"
                  onClick={handleTrailerClick}
                >
                  Смотреть трейлер
                </button>
                
                <div className="movie-actions-buttons-mobile">
                  <button 
                    className={`btn btn--icon ${isFavorited ? 'btn--favorited' : ''}`}
                    onClick={handleFavoriteClick}
                    title={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    <span className="icon-heart">{isFavorited ? '❤️' : '🤍'}</span>
                  </button>
                </div>
              </div>
              
              <div className="movie-details">
                <h2 className="details-title">О фильме</h2>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Год:</span>
                    <span className="detail-value">{movie.year}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Страна:</span>
                    <span className="detail-value">{movie.country}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Режиссер:</span>
                    <span className="detail-value">{movie.director}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Актеры:</span>
                    <span className="detail-value">{movie.actors.join(', ')}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Рейтинг:</span>
                    <span className="detail-value rating">★ {movie.rating}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Жанр:</span>
                    <span className="detail-value">{movie.genre}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Бюджет:</span>
                    <span className="detail-value">{movie.budget}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Сборы:</span>
                    <span className="detail-value">{movie.boxOffice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => dispatch({ type: 'modal/closeAuthModal' })}
      />
      
      <TrailerModal 
        isOpen={isTrailerModalOpen}
        onClose={() => dispatch({ type: 'modal/closeTrailerModal' })}
        trailerUrl={trailerUrl}
      />
    </div>
  );
};

export default MoviePage;
