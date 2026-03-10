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

  const parseRating = (rating: number | string | null | undefined): number | null => {
    if (typeof rating === 'number') {
      return Number.isNaN(rating) ? null : rating;
    }
    if (typeof rating === 'string') {
      const numeric = Number.parseFloat(rating.replace(',', '.'));
      return Number.isNaN(numeric) ? null : numeric;
    }
    return null;
  };

  const getRatingVariant = (rating: number | string | null | undefined): 'excellent' | 'good' | 'average' | 'poor' => {
    const numeric = parseRating(rating);
    if (numeric === null) return 'average';
    if (numeric >= 8) return 'excellent';
    if (numeric >= 7) return 'good';
    if (numeric >= 5) return 'average';
    return 'poor';
  };

  const formatRatingValue = (rating: number | string | null | undefined): string => {
    const numeric = parseRating(rating);
    if (numeric === null) {
      return '--';
    }
    return numeric.toFixed(1).replace('.', ',');
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
              <div className="detail-item">
                <span className={`detail-value detail-value--rating detail-value--rating--${getRatingVariant(movie.rating)}`}>
                  <svg className="rating-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27Z" />
                  </svg>
                  <span className="rating-value">{formatRatingValue(movie.rating)}</span>
                </span>
              </div>
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
                  <svg className="icon-heart" width="68" height="56" viewBox="0 0 68 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="68" height="56" rx="28" fill="#393B3C"/>
                    <rect x="0.5" y="0.5" width="67" height="55" rx="27.5" stroke="black" strokeOpacity="0.4"/>
                    {isFavorited ? (
                      <path
                        d="M38.5 19C41.5376 19 44 21.5 44 25C44 32 36.5 36 34 37.5C31.5 36 24 32 24 25C24 21.5 26.5 19 29.5 19C31.36 19 33 20 34 21C35 20 36.64 19 38.5 19Z"
                        fill="#B4A9FF"
                      />
                    ) : (
                      <path
                        d="M38.5 19C41.5376 19 44 21.5 44 25C44 32 36.5 36 34 37.5C31.5 36 24 32 24 25C24 21.5 26.5 19 29.5 19C31.36 19 33 20 34 21C35 20 36.64 19 38.5 19Z"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.2"
                      />
                    )}
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
