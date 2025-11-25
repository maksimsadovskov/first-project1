import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setQuery, searchMovies, clearResults } from '../../store/slices/searchSlice';
import './MobileSearchModal.css';
import iconSearch from '../../assets/icons/icon-search.svg';
import closeButton from '../../assets/icons/close-button.svg';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { query, results, isSearching } = useAppSelector((state) => state.search);
  const { featuredMovie } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (query.trim()) {
      dispatch(searchMovies(query));
    } else {
      dispatch(clearResults());
    }
  }, [query, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(setQuery(''));
      dispatch(clearResults());
    }
  }, [isOpen, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  const handleResultClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  // Первые 5 результатов
  const displayResults = results.slice(0, 5);
  const showSearchResults = query.trim().length > 0;

  return (
    <div className="mobile-search-modal">
      {/* Хедер поиска поверх всего */}
      <div className="mobile-search-modal__header">
        <img className="mobile-search-modal__search-icon" src={iconSearch} alt="Поиск" width={20} height={20} />
        <input
          type="text"
          className="mobile-search-modal__input"
          placeholder="Поиск"
          value={query}
          onChange={handleInputChange}
          autoFocus
        />
        <button className="mobile-search-modal__close" onClick={onClose}>
          <img src={closeButton} alt="Закрыть" width={12} height={12} />
        </button>
      </div>

      {/* Фоновая карточка главного фильма 375×520 — всегда видна */}
      {featuredMovie && (
        <div className="mobile-search-featured-card">
          <img 
            src={featuredMovie.poster} 
            alt={featuredMovie.title}
            className="mobile-search-featured-card__poster"
          />
          <div className="mobile-search-featured-card__info">
            <div className="mobile-search-featured-card__meta">
              <span className="mobile-search-featured-card__rating">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                {featuredMovie.rating.toFixed(1)}
              </span>
              <span className="mobile-search-featured-card__year">{featuredMovie.year}</span>
              <span className="mobile-search-featured-card__genre">{featuredMovie.genre}</span>
              <span className="mobile-search-featured-card__duration">{featuredMovie.runtime || 127} мин</span>
            </div>
            <h2 className="mobile-search-featured-card__title">{featuredMovie.title}</h2>
            <p className="mobile-search-featured-card__description">{featuredMovie.description}</p>
          </div>
        </div>
      )}

      {/* Dropdown с результатами — появляется только при вводе текста поверх фонового фильма */}
      {showSearchResults && (
        <div className="mobile-search-modal__dropdown-container">
          <div className="mobile-search-modal__content">
            {isSearching ? (
              <div className="mobile-search-modal__loading">Поиск...</div>
            ) : displayResults.length > 0 ? (
              <div className="mobile-search-modal__results">
                {displayResults.map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="mobile-search-result"
                    onClick={handleResultClick}
                  >
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="mobile-search-result__poster"
                    />
                    <div className="mobile-search-result__content">
                      <span className="mobile-search-result__rating">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        {movie.rating.toFixed(1)}
                      </span>
                      <div className="mobile-search-result__year-genre">
                        <span>{movie.year}</span>
                        <span>{movie.genre}</span>
                      </div>
                      <span className="mobile-search-result__duration">{movie.runtime || 127} мин</span>
                      <h3 className="mobile-search-result__title">{movie.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mobile-search-modal__no-results">Фильмы не найдены</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearchModal;

