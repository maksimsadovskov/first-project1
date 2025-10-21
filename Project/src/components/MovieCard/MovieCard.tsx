import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openAuthModal } from '../../store/slices/modalSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/moviesSlice';
import { Movie } from '../../types';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  showFavorite?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  showFavorite = true, 
  size = 'medium' 
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.movies);
  
  const [isFavoriteState, setIsFavoriteState] = useState<boolean>(
    favorites.some(fav => fav.id === movie.id)
  );

  const handleFavoriteClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      dispatch(openAuthModal());
      return;
    }

    if (isFavoriteState) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie.id));
    }
    
    setIsFavoriteState(!isFavoriteState);
  };

  const cardClassName = `movie-card movie-card--${size}`;

  return (
    <Link to={`/movie/${movie.id}`} className={cardClassName}>
      <div className="movie-card__poster">
        <img src={movie.poster} alt={movie.title} />
        {showFavorite && (
          <button 
            className={`favorite-btn ${isFavoriteState ? 'favorite-btn--active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavoriteState ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            ♥
          </button>
        )}
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__details">
          <span className="movie-card__year">{movie.year}</span>
          <span className="movie-card__rating">★ {movie.rating}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
