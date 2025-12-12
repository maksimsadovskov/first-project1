import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setQuery, searchMovies } from '../../store/slices/searchSlice';
import './HeaderSearch.css';
import iconSearch from '../../assets/icons/icon-search.svg';
import closeButton from '../../assets/icons/close-button.svg';

const HeaderSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { query, results, isSearching } = useAppSelector((state) => state.search);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchMovies(searchQuery));
      }
    }, 300); // 300ms delay
  }, [dispatch]);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      // Очищаем таймер при очистке запроса
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debouncedSearch]);

  // Открываем выпадающий список при наличии результатов или при поиске
  useEffect(() => {
    if (query.trim() && (isSearching || results.length > 0)) {
      setIsOpen(true);
    }
  }, [query, isSearching, results]);

  // Открываем выпадающий список при наличии результатов или при поиске
  useEffect(() => {
    if (query.trim() && (isSearching || results.length > 0)) {
      setIsOpen(true);
    }
  }, [query, isSearching, results]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  const handleResultClick = () => {
    setIsOpen(false);
    dispatch(setQuery(''));
  };

  const handleClear = () => {
    dispatch(setQuery(''));
    setIsOpen(false);
  };

  // Показываем первые 5 результатов
  const displayResults = results.slice(0, 5);

  return (
    <div className="header-search" ref={searchRef}>
      <div className="header-search__input-container">
        <img className="header-search__icon" src={iconSearch} alt="Иконка поиска" width={20} height={20} />
        <input
          type="text"
          className="header-search__input"
          placeholder="Поиск"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
        />
        {query.trim().length > 0 && (
          <button className="header-search__clear" onClick={handleClear} aria-label="Очистить поиск">
            <img src={closeButton} alt="Очистить" width={13} height={13} />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="header-search__dropdown">
          {isSearching ? (
            <div className="header-search__loading">Поиск...</div>
          ) : displayResults.length > 0 ? (
            <div className="header-search__results">
              {displayResults.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="header-search__result-item"
                  onClick={handleResultClick}
                >
                  {movie.poster && (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="header-search__result-poster"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                  />
                  )}
                  <div className="header-search__result-info">
                    <div className="header-search__result-meta">
                      <span className="header-search__result-rating">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        {movie.rating ? movie.rating.toFixed(1) : '0.0'}
                      </span>
                      <span className="header-search__result-year">{movie.year || '—'}</span>
                      <span className="header-search__result-genre">{movie.genre || '—'}</span>
                      <span className="header-search__result-duration">{movie.runtime || 127} мин</span>
                    </div>
                    <h4 className="header-search__result-title">{movie.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="header-search__no-results">Фильмы не найдены</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;

