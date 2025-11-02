import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGenres } from '../../store/slices/moviesSlice';
import GenreCard from '../../components/GenreCard/GenreCard';
import './Genres.css';

const Genres: React.FC = () => {
  const dispatch = useAppDispatch();
  const { genres, isLoading } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, genres.length]);

  if (isLoading && genres.length === 0) {
    return (
      <div className="genres-loading">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="genres">
      <div className="container">
        <div className="genres-header">
          <h1 className="genres-title">Жанры фильмов</h1>
        </div>
        
        <div className="genres-grid">
          {genres.slice(0, 8).map(genre => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Genres;
