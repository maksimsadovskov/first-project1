import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRandomMovie, fetchTopMovies, addToFavorites, removeFromFavorites } from '../../store/slices/moviesSlice';
import { openAuthModal, openTrailerModal, closeTrailerModal } from '../../store/slices/modalSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import AuthModal from '../../components/AuthModal/AuthModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredMovie, topMovies, isLoading, favorites } = useAppSelector((state) => state.movies);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isAuthModalOpen, isTrailerModalOpen, trailerUrl, trailerTitle } = useAppSelector((state) => state.modal);

  // Проверка ширины экрана для модификатора (до 888px, как в хедере)
  const [isMobile375, setIsMobile375] = React.useState(window.innerWidth <= 888);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile375(window.innerWidth <= 888);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Загружаем только если данные еще не загружены (они уже загружаются в App.tsx)
    // Но если данных нет, загружаем их здесь
    if (!featuredMovie) {
      dispatch(fetchRandomMovie());
    }
    if (topMovies.length === 0) {
      dispatch(fetchTopMovies());
    }
  }, [dispatch, featuredMovie, topMovies.length]);

  useEffect(() => {
    // Диагностика обрезки номеров на мобиле
    if (window.innerWidth <= 768 && topMovies.length > 0) {
      const timer = setTimeout(() => {
        const grid = document.getElementById('top-movies-grid');
        if (grid) {
          const gridPadding = window.getComputedStyle(grid).paddingTop;
          const gridPaddingLeft = window.getComputedStyle(grid).paddingLeft;
          const firstRank = grid.querySelector('.top-movie-item__rank');
          const firstItem = grid.querySelector('.top-movie-item');
          if (firstRank && firstItem) {
            const rankRect = firstRank.getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();
            const itemRect = firstItem.getBoundingClientRect();
            const rankTop = rankRect.top;
            const gridTop = gridRect.top;
            const rankLeft = rankRect.left;
            const gridLeft = gridRect.left;
            const itemLeft = itemRect.left;
            const visibleTop = rankTop - gridTop;
            const visibleLeft = rankLeft - gridLeft;
            console.log('🔍 Диагностика обрезки номеров:');
            console.log(`  - Padding-top grid: ${gridPadding}`);
            console.log(`  - Padding-left grid: ${gridPaddingLeft}`);
            console.log(`  - Позиция номера от верха grid: ${visibleTop}px`);
            console.log(`  - Позиция номера слева от grid: ${visibleLeft}px`);
            console.log(`  - Позиция первого элемента слева от grid: ${itemLeft - gridLeft}px`);
            console.log(`  - Высота номера: ${rankRect.height}px`);
            console.log(`  - Ширина номера: ${rankRect.width}px`);
            console.log(`  - Номер должен быть на: -12px (top: -12px, left: -12px)`);
            console.log(`  - Видимая часть сверху: ${Math.max(0, visibleTop)}px`);
            console.log(`  - Видимая часть слева: ${Math.max(0, visibleLeft)}px`);
            if (visibleTop < 0) {
              console.warn(`  ⚠️ Номер обрезан сверху на ${Math.abs(visibleTop)}px`);
              console.log(`  💡 Нужно увеличить padding-top до ${parseInt(gridPadding) + Math.abs(visibleTop) + 12}px`);
            } else {
              console.log(`  ✅ Номер не обрезан сверху`);
            }
            if (visibleLeft < 0) {
              console.warn(`  ⚠️ Номер обрезан слева на ${Math.abs(visibleLeft)}px`);
              console.log(`  💡 Нужно увеличить padding-left до ${parseInt(gridPaddingLeft) + Math.abs(visibleLeft) + 12}px`);
            } else {
              console.log(`  ✅ Номер не обрезан слева`);
            }
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [topMovies.length]);

  const handleGetNewMovie = (): void => {
    dispatch(fetchRandomMovie());
  };

  const handleTrailerClick = (): void => {
    if (featuredMovie) {
      dispatch(openTrailerModal({ url: featuredMovie.trailer, title: featuredMovie.title }));
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

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }


  const isFeaturedFavorite = featuredMovie
    ? favorites.some((fav) => fav.id === featuredMovie.id)
    : false;

  return (
    <div className={`dashboard ${isMobile375 ? 'dashboard--mobile-375' : ''}`}>
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
                    <span className={`detail-value detail-value--rating detail-value--rating--${getRatingVariant(featuredMovie.rating)}`}>
                      <svg className="rating-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27Z" />
                      </svg>
                      <span className="rating-value">{formatRatingValue(featuredMovie.rating)}</span>
                    </span>
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
                    className={`action-btn action-btn--favorite ${isFeaturedFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label="Добавить в избранное"
                  >
                    <svg width="68" height="56" viewBox="0 0 68 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="68" height="56" rx="28" fill="#393B3C"/>
                      <rect x="0.5" y="0.5" width="67" height="55" rx="27.5" stroke="black" strokeOpacity="0.4"/>
                      {isFeaturedFavorite ? (
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
                  <button 
                    className="action-btn action-btn--refresh"
                    onClick={handleGetNewMovie}
                    aria-label="Получить новый фильм"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2C12.7486 2 15.1749 3.38626 16.6156 5.5H14V7.5H20V1.5H18V3.99936C16.1762 1.57166 13.2724 0 10 0C4.47715 0 0 4.47715 0 10H2C2 5.58172 5.58172 2 10 2ZM18 10C18 14.4183 14.4183 18 10 18C7.25144 18 4.82508 16.6137 3.38443 14.5H6V12.5H0V18.5H2V16.0006C3.82381 18.4283 6.72764 20 10 20C15.5228 20 20 15.5228 20 10H18Z" fill="white"/>
                    </svg>
                  </button>
                  
                  {/* Мобильная версия */}
                  <div className="mobile-second-row">
                    <Link to={`/movie/${featuredMovie.id}`} className="btn btn--secondary">
                      О фильме
                    </Link>
                    <button 
                      className={`action-btn action-btn--favorite ${isFeaturedFavorite ? 'active' : ''}`}
                      onClick={handleFavoriteClick}
                      aria-label="Добавить в избранное"
                    >
                      <svg width="68" height="56" viewBox="0 0 68 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="68" height="56" rx="28" fill="#393B3C"/>
                        <rect x="0.5" y="0.5" width="67" height="55" rx="27.5" stroke="black" strokeOpacity="0.4"/>
                        {isFeaturedFavorite ? (
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
                    <button 
                      className="action-btn action-btn--refresh"
                      onClick={handleGetNewMovie}
                      aria-label="Получить новый фильм"
                    >
                      <svg width="68" height="56" viewBox="0 0 68 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="68" height="56" rx="28" fill="#393B3C"/>
                        <rect x="0.5" y="0.5" width="67" height="55" rx="27.5" stroke="black" strokeOpacity="0.4"/>
                        <g transform="translate(24, 18)">
                          <path d="M10 2C12.7486 2 15.1749 3.38626 16.6156 5.5H14V7.5H20V1.5H18V3.99936C16.1762 1.57166 13.2724 0 10 0C4.47715 0 0 4.47715 0 10H2C2 5.58172 5.58172 2 10 2ZM18 10C18 14.4183 14.4183 18 10 18C7.25144 18 4.82508 16.6137 3.38443 14.5H6V12.5H0V18.5H2V16.0006C3.82381 18.4283 6.72764 20 10 20C15.5228 20 20 15.5228 20 10H18Z" fill="white"/>
                        </g>
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
          <div className="top-movies__grid" id="top-movies-grid">
            {topMovies.map((movie, index) => (
              <div key={movie.id} className="top-movie-item">
                <div className="top-movie-item__rank">
                  {index + 1}
                </div>
                <MovieCard movie={movie} size="small" showFavorite={false} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => dispatch({ type: 'modal/closeAuthModal' })}
      />

      <TrailerModal 
        isOpen={isTrailerModalOpen}
        onClose={() => dispatch(closeTrailerModal())}
        trailerUrl={trailerUrl}
        trailerTitle={trailerTitle}
      />
    </div>
  );
};

export default Dashboard;
