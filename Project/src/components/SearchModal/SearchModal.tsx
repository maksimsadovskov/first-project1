import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setQuery, clearResults, searchMovies } from '../../store/slices/searchSlice';
import { closeSearchModal } from '../../store/slices/modalSlice';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { query, results, isSearching } = useAppSelector((state) => state.search);

  useEffect(() => {
    if (query.trim()) {
      dispatch(searchMovies(query));
    } else {
      dispatch(clearResults());
    }
  }, [query, dispatch]);

  useEffect(() => {
    if (isOpen) {
      const input = document.querySelector('.search-modal__input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    } else {
      // Clear search when modal closes
      dispatch(setQuery(''));
      dispatch(clearResults());
    }
  }, [isOpen, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(setQuery(e.target.value));
  };

  const handleResultClick = (): void => {
    dispatch(closeSearchModal());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="search-modal__header">
          <h2 className="search-modal__title">Поиск фильмов</h2>
        </div>
        
        <div className="search-modal__content">
          <div className="search-modal__input-container">
            <input
              type="text"
              className="search-modal__input"
              placeholder="Введите название фильма..."
              value={query}
              onChange={handleInputChange}
            />
            <span className="search-modal__icon">🔍</span>
          </div>
          
          {query.trim() && (
            <div className="search-modal__results">
              {isSearching ? (
                <div className="search-modal__loading">
                  Поиск...
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="search-modal__results-header">
                    Найдено фильмов: {results.length}
                  </div>
                  <div className="search-modal__results-list">
                    {results.map(movie => (
                      <a
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="search-modal__result-item"
                        onClick={handleResultClick}
                      >
                        <img 
                          src={movie.poster} 
                          alt={movie.title}
                          className="search-modal__result-poster"
                        />
                        <div className="search-modal__result-info">
                          <h3 className="search-modal__result-title">{movie.title}</h3>
                          <div className="search-modal__result-details">
                            <span className="search-modal__result-year">{movie.year}</span>
                            <span className="search-modal__result-rating">★ {movie.rating}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <div className="search-modal__no-results">
                  Фильмы не найдены
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
