import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Genre } from '../../types';
import './GenreCard.css';

interface GenreCardProps {
  genre: Genre;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  // Функция для создания SVG placeholder через data URI (fallback)
  const createPlaceholderImage = (text: string, bgColor: string = '666666', textColor: string = 'ffffff'): string => {
    const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };
  
  // Маппинг цветов для жанров (для fallback)
  const genreColorMap: { [key: string]: string } = {
    'Драма': '4285f4',
    'Комедия': '34a853',
    'Боевик': 'ea4335',
    'Триллер': '9c27b0',
    'Ужасы': 'ff9800',
    'Фантастика': '00bcd4',
    'Приключения': '4caf50',
    'Мультфильмы': 'ff5722',
    'Мультфильм': 'ff5722',
    'Мелодрама': 'e91e63',
    'Детектив': '607d8b',
    'Криминал': '607d8b',
    'Военный': '795548',
    'Исторический': '9e9e9e',
    'Документальный': '009688',
    'Семейный': 'ffc107',
    'Музыка': 'ff4081',
    'Вестерн': '8d6e63',
    'Стендап': '9c27b0'
  };
  
  // Используем изображение из genre.image (может быть URL постер или SVG placeholder)
  let imageSrc = genre.image || '';
  
  // Логируем для отладки
  if (imageSrc && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'))) {
    console.log(`GenreCard: Используем постер для жанра ${genre.name}:`, imageSrc);
  }
  
  // Если изображение не задано или это не валидный URL, создаем SVG placeholder
  if (!imageSrc || (!imageSrc.startsWith('http://') && !imageSrc.startsWith('https://') && !imageSrc.startsWith('data:'))) {
    const bgColor = genreColorMap[genre.name] || '666666';
    imageSrc = createPlaceholderImage(genre.name, bgColor, 'ffffff');
    console.log(`GenreCard: Используем placeholder для жанра ${genre.name}, genre.image:`, genre.image);
  }
  
  return (
    <Link to={`/genre/${genre.id}`} className="genre-card">
      <div className="genre-card__image">
        <img 
          src={imageSrc} 
          alt={genre.name}
          loading="lazy"
          onError={(e) => {
            // Если изображение не загрузилось, используем SVG placeholder
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('data:image/svg+xml')) {
              const bgColor = genreColorMap[genre.name] || '666666';
              target.src = createPlaceholderImage(genre.name, bgColor, 'ffffff');
            }
          }}
        />
      </div>
      <div className="genre-card__footer">
        <h3 className="genre-card__title">{genre.name}</h3>
      </div>
    </Link>
  );
};

export default GenreCard;
