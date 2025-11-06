import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setQuery, searchMovies } from '../../store/slices/searchSlice';
import './HeaderSearch.css';

const HeaderSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { query, results, isSearching } = useAppSelector((state) => state.search);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      dispatch(searchMovies(query));
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, dispatch]);

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

  // Показываем первые 5 результатов
  const displayResults = results.slice(0, 5);

  return (
    <div className="header-search" ref={searchRef}>
      <div className="header-search__input-container">
        <input
          type="text"
          className="header-search__input"
          placeholder="Поиск фильмов..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
        />
        <svg className="header-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="header-search__result-poster"
                  />
                  <div className="header-search__result-info">
                    <div className="header-search__result-meta">
                      <span className="header-search__result-rating">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        {movie.rating.toFixed(1)}
                      </span>
                      <span className="header-search__result-year">{movie.year}</span>
                      <span className="header-search__result-genre">{movie.genre}</span>
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

