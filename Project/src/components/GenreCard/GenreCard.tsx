import React from 'react';
import { Link } from 'react-router-dom';
import { Genre } from '../../types';
import './GenreCard.css';

interface GenreCardProps {
  genre: Genre;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {

  return (
    <Link to={`/genre/${genre.id}`} className="genre-card">
      <div className="genre-card__image">
        <img src={genre.image || 'https://via.placeholder.com/300x200/666/ffffff?text=Жанр'} alt={genre.name} />
      </div>
      <div className="genre-card__footer">
        <h3 className="genre-card__title">{genre.name}</h3>
      </div>
    </Link>
  );
};

export default GenreCard;
