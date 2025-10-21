import { Movie, Genre } from '../types';

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Шерлок Холмс и доктор Ватсон: Знакомство',
    year: 2023,
    country: 'Россия',
    director: 'Иван Иванов',
    actors: ['Алексей Иванов', 'Петр Петров'],
    rating: 8.5,
    budget: '250 000 руб.',
    boxOffice: '1 000 000 руб.',
    genre: 'Детектив',
    poster: 'https://picsum.photos/680/552?random=1',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Увлекательная история о первой встрече легендарного сыщика и его верного помощника.'
  },
  {
    id: 2,
    title: 'Холоп',
    year: 2022,
    country: 'Россия',
    director: 'Клим Шипенко',
    actors: ['Милош Бикович', 'Александра Бортич'],
    rating: 7.8,
    budget: '500 000 руб.',
    boxOffice: '2 500 000 руб.',
    genre: 'Комедия',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Kholop',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Современная комедия о том, как богатый наследник попадает в прошлое.'
  },
  {
    id: 3,
    title: 'Воздух',
    year: 2023,
    country: 'Россия',
    director: 'Алексей Герман мл.',
    actors: ['Максим Суханов', 'Анна Михалкова'],
    rating: 7.2,
    budget: '300 000 руб.',
    boxOffice: '800 000 руб.',
    genre: 'Драма',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Vozdukh',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Драматическая история о человеческих отношениях и выборе.'
  },
  {
    id: 4,
    title: 'Лед',
    year: 2023,
    country: 'Россия',
    director: 'Олег Трофим',
    actors: ['Аглая Тарасова', 'Александр Петров'],
    rating: 6.9,
    budget: '400 000 руб.',
    boxOffice: '1 200 000 руб.',
    genre: 'Мелодрама',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Ice',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Романтическая история о любви и самопожертвовании.'
  },
  {
    id: 5,
    title: 'Гаврилов',
    year: 2023,
    country: 'Россия',
    director: 'Сергей Мокрицкий',
    actors: ['Владимир Машков', 'Евгения Добровольская'],
    rating: 8.1,
    budget: '600 000 руб.',
    boxOffice: '1 800 000 руб.',
    genre: 'Боевик',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Gavrilov',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Напряженный боевик о работе спецслужб.'
  },
  {
    id: 6,
    title: 'Джентльмены',
    year: 2022,
    country: 'Россия',
    director: 'Игорь Волошин',
    actors: ['Алексей Серебряков', 'Евгений Миронов'],
    rating: 7.5,
    budget: '350 000 руб.',
    boxOffice: '1 100 000 руб.',
    genre: 'Криминал',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Gentlemen',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Криминальная драма о подпольном мире.'
  },
  {
    id: 7,
    title: 'Оппенгеймер',
    year: 2023,
    country: 'США',
    director: 'Кристофер Нолан',
    actors: ['Киллиан Мерфи', 'Эмили Блант'],
    rating: 8.8,
    budget: '100 000 000 $',
    boxOffice: '950 000 000 $',
    genre: 'Драма',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Oppenheimer',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Биографическая драма о создателе атомной бомбы.'
  },
  {
    id: 8,
    title: 'Барби',
    year: 2023,
    country: 'США',
    director: 'Грета Гервиг',
    actors: ['Марго Робби', 'Райан Гослинг'],
    rating: 7.3,
    budget: '145 000 000 $',
    boxOffice: '1 446 000 000 $',
    genre: 'Комедия',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Barbie',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Яркая комедия о приключениях Барби в реальном мире.'
  },
  {
    id: 9,
    title: 'Стражи Галактики 3',
    year: 2023,
    country: 'США',
    director: 'Джеймс Ганн',
    actors: ['Крис Прэтт', 'Зои Салдана'],
    rating: 8.0,
    budget: '250 000 000 $',
    boxOffice: '845 000 000 $',
    genre: 'Фантастика',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Guardians3',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Финальная часть приключений команды Стражи Галактики.'
  },
  {
    id: 10,
    title: 'Чебурашка',
    year: 2022,
    country: 'Россия',
    director: 'Дмитрий Дьяченко',
    actors: ['Сергей Гармаш', 'Ольга Кузнецова'],
    rating: 7.7,
    budget: '450 000 руб.',
    boxOffice: '3 000 000 руб.',
    genre: 'Семейный',
    poster: 'https://picsum.photos/300x450/2a2a2a/ffffff?text=Cheburashka',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Семейная комедия о приключениях Чебурашки в современном мире.'
  }
];

export const mockGenres: Genre[] = [
  { id: 1, name: 'Драма', slug: 'drama', image: 'https://picsum.photos/300x200/4285f4/ffffff?text=Drama' },
  { id: 2, name: 'Комедия', slug: 'comedy', image: 'https://picsum.photos/300x200/34a853/ffffff?text=Comedy' },
  { id: 3, name: 'Боевик', slug: 'action', image: 'https://picsum.photos/300x200/ea4335/ffffff?text=Action' },
  { id: 4, name: 'Триллер', slug: 'thriller', image: 'https://picsum.photos/300x200/9c27b0/ffffff?text=Thriller' },
  { id: 5, name: 'Ужасы', slug: 'horror', image: 'https://picsum.photos/300x200/ff9800/ffffff?text=Horror' },
  { id: 6, name: 'Фантастика', slug: 'fantasy', image: 'https://picsum.photos/300x200/00bcd4/ffffff?text=Fantasy' },
  { id: 7, name: 'Приключения', slug: 'adventure', image: 'https://picsum.photos/300x200/4caf50/ffffff?text=Adventure' },
  { id: 8, name: 'Мультфильмы', slug: 'animation', image: 'https://picsum.photos/300x200/ff5722/ffffff?text=Animation' },
  { id: 9, name: 'Мелодрама', slug: 'romance', image: 'https://picsum.photos/300x200/e91e63/ffffff?text=Romance' },
  { id: 10, name: 'Детектив', slug: 'detective', image: 'https://picsum.photos/300x200/607d8b/ffffff?text=Detective' }
];

export const getRandomMovie = (): Movie => {
  return {
    id: 1,
    title: 'Шерлок Холмс и доктор Ватсон: Знакомство',
    year: 1979,
    description: 'Увлекательные приключения самого известного сыщика всех времен',
    director: 'Игорь Масленников',
    actors: ['Василий Ливанов', 'Виталий Соломин'],
    rating: 7.5,
    budget: '250 000 руб.',
    boxOffice: '1 000 000 руб.',
    genre: 'Детектив',
    country: 'СССР',
    poster: 'https://picsum.photos/680/552?random=1',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  };
};

export const getTopMovies = (): Movie[] => {
  const topMoviesData = [
    { title: 'Беспринципные', year: 2022, rating: 8.8, genre: 'Драма', actors: ['Алексей Серебряков', 'Евгений Миронов'], poster: 'https://picsum.photos/224/336?random=1' },
    { title: 'Воздух', year: 2023, rating: 7.2, genre: 'Драма', actors: ['Максим Суханов', 'Анна Михалкова'], poster: 'https://picsum.photos/224/336?random=2' },
    { title: 'Лед', year: 2018, rating: 6.9, genre: 'Мелодрама', actors: ['Аглая Тарасова', 'Александр Петров'], poster: 'https://picsum.photos/224/336?random=3' },
    { title: 'Внутри убийцы', year: 2021, rating: 7.8, genre: 'Триллер', actors: ['Владимир Машков', 'Евгения Добровольская'], poster: 'https://picsum.photos/224/336?random=4' },
    { title: 'Папины дочки', year: 2020, rating: 7.5, genre: 'Комедия', actors: ['Александр Петров', 'Мария Кожевникова'], poster: 'https://picsum.photos/224/336?random=5' },
    { title: 'Холоп', year: 2019, rating: 7.8, genre: 'Комедия', actors: ['Милош Бикович', 'Александра Бортич'], poster: 'https://picsum.photos/224/336?random=6' },
    { title: 'Три богатыря', year: 2017, rating: 7.0, genre: 'Мультфильм', actors: ['Сергей Маковецкий', 'Дмитрий Быковский'], poster: 'https://picsum.photos/224/336?random=7' },
    { title: 'Инспектор Гаврилов', year: 2023, rating: 8.1, genre: 'Боевик', actors: ['Владимир Машков', 'Евгения Добровольская'], poster: 'https://picsum.photos/224/336?random=8' },
    { title: 'Шифр', year: 2022, rating: 7.9, genre: 'Детектив', actors: ['Алексей Иванов', 'Петр Петров'], poster: 'https://picsum.photos/224/336?random=9' },
    { title: 'Командир', year: 2021, rating: 8.2, genre: 'Боевик', actors: ['Владимир Машков', 'Анна Михалкова'], poster: 'https://picsum.photos/224/336?random=10' }
  ];

  return topMoviesData.map((movieData, index) => ({
    id: index + 1,
    title: movieData.title,
    year: movieData.year,
    description: `Описание фильма "${movieData.title}"`,
    director: 'Режиссер',
    actors: movieData.actors,
    rating: movieData.rating,
    budget: '250 000 руб.',
    boxOffice: '1 000 000 руб.',
    genre: movieData.genre,
    country: 'Россия',
    poster: movieData.poster,
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }));
};

export const getMoviesByGenre = (genreId: number): Movie[] => {
  const genre = mockGenres.find(g => g.id === genreId);
  if (!genre) return [];
  return mockMovies.filter(movie => movie.genre === genre.name);
};

export const searchMovies = (query: string): Movie[] => {
  if (!query.trim()) return [];
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
};
