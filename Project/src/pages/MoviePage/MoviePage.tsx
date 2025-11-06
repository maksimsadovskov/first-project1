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
  const { isAuthModalOpen, isTrailerModalOpen, trailerUrl, trailerTitle } = useAppSelector((state) => state.modal);
  
  const { movies } = useAppSelector((state) => state.movies);
  const [movie, setMovie] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  
  // Проверка ширины экрана для модификатора
  const [isMobile375, setIsMobile375] = React.useState(window.innerWidth <= 375);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile375(window.innerWidth <= 375);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!movieId) return;
    const found = movies.find(m => m.id === parseInt(movieId));
    if (found) {
      setMovie(found);
      return;
    }
    // Fallback: fetch by ID from API
    import('../../services/api').then(({ default: api }) => {
      api.getMovieById(parseInt(movieId))
        .then((data) => setMovie(data))
        .catch(() => setMovie(null));
    });
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
      dispatch(openTrailerModal({ url: movie.trailer, title: movie.title }));
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
    <div className={`movie-page ${isMobile375 ? 'movie-page--mobile-375' : ''}`}>
      <div className="container">
        <div className="movie-container">
        <div className="movie-content">
          <div className="movie-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>
          
          <div className="movie-info">
            <div className="movie-top-details">
              <div className="detail-item"><span className="detail-value detail-value--rating">★{movie.rating}</span></div>
              <div className="detail-item"><span className="detail-value">{movie.year}</span></div>
              <div className="detail-item"><span className="detail-value">{movie.genre}</span></div>
              <div className="detail-item"><span className="detail-value">{movie.duration || '1 ч 7 мин'}</span></div>
            </div>
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-actions">
              <button 
                className="btn btn--primary btn-trailer"
                onClick={handleTrailerClick}
              >
                Трейлер
              </button>
              <button 
                className={`btn btn--icon ${isFavorited ? 'btn--favorited' : ''}`}
                onClick={handleFavoriteClick}
                title={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <svg className="icon-heart" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Раздел О фильме ниже */}
        <section className="movie-specs">
          <h2 className="details-title">О фильме</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Язык оригинала:</span>
              <span className="detail-value">Русский</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Бюджет:</span>
              <span className="detail-value">{movie.budget || '2 500 000 руб.'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Выручка:</span>
              <span className="detail-value">{movie.boxOffice || '3 000 000 руб.'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Режиссер:</span>
              <span className="detail-value">{movie.director || 'Игорь Иванов'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Продакшн:</span>
              <span className="detail-value">Ленфильм</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Награды:</span>
              <span className="detail-value">Топ-20</span>
            </div>
          </div>
        </section>
            
          </div>
        </section>
            
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
        trailerTitle={trailerTitle}
      />
    </div>
  );
};

export default MoviePage;
