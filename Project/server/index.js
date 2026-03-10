const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// --- In-memory data ---
const genres = [
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

const baseMovies = [
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
    description: 'Увлекательная история о первой встрече сыщика и его помощника.'
  },
  { id: 2, title: 'Холоп', year: 2022, country: 'Россия', director: 'Клим Шипенко', actors: ['Милош Бикович', 'Александра Бортич'], rating: 7.8, budget: '500 000 руб.', boxOffice: '2 500 000 руб.', genre: 'Комедия', poster: 'https://picsum.photos/300/450?random=2', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Современная комедия.' },
  { id: 3, title: 'Воздух', year: 2023, country: 'Россия', director: 'Алексей Герман мл.', actors: ['Максим Суханов', 'Анна Михалкова'], rating: 7.2, budget: '300 000 руб.', boxOffice: '800 000 руб.', genre: 'Драма', poster: 'https://picsum.photos/300/450?random=3', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Драма о человеческих отношениях.' },
  { id: 4, title: 'Лед', year: 2023, country: 'Россия', director: 'Олег Трофим', actors: ['Аглая Тарасова', 'Александр Петров'], rating: 6.9, budget: '400 000 руб.', boxOffice: '1 200 000 руб.', genre: 'Мелодрама', poster: 'https://picsum.photos/300/450?random=4', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Романтическая история.' },
  { id: 5, title: 'Гаврилов', year: 2023, country: 'Россия', director: 'Сергей Мокрицкий', actors: ['Владимир Машков', 'Евгения Добровольская'], rating: 8.1, budget: '600 000 руб.', boxOffice: '1 800 000 руб.', genre: 'Боевик', poster: 'https://picsum.photos/300/450?random=5', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Напряженный боевик.' },
  { id: 6, title: 'Джентльмены', year: 2022, country: 'Россия', director: 'Игорь Волошин', actors: ['Алексей Серебряков', 'Евгений Миронов'], rating: 7.5, budget: '350 000 руб.', boxOffice: '1 100 000 руб.', genre: 'Криминал', poster: 'https://picsum.photos/300/450?random=6', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Криминальная драма.' },
  { id: 7, title: 'Оппенгеймер', year: 2023, country: 'США', director: 'Кристофер Нолан', actors: ['Киллиан Мерфи', 'Эмили Блант'], rating: 8.8, budget: '100 000 000 $', boxOffice: '950 000 000 $', genre: 'Драма', poster: 'https://picsum.photos/300/450?random=7', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Биографическая драма.' },
  { id: 8, title: 'Барби', year: 2023, country: 'США', director: 'Грета Гервиг', actors: ['Марго Робби', 'Райан Гослинг'], rating: 7.3, budget: '145 000 000 $', boxOffice: '1 446 000 000 $', genre: 'Комедия', poster: 'https://picsum.photos/300/450?random=8', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Яркая комедия.' },
  { id: 9, title: 'Стражи Галактики 3', year: 2023, country: 'США', director: 'Джеймс Ганн', actors: ['Крис Прэтт', 'Зои Салдана'], rating: 8.0, budget: '250 000 000 $', boxOffice: '845 000 000 $', genre: 'Фантастика', poster: 'https://picsum.photos/300/450?random=9', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Финальная часть приключений.' },
  { id: 10, title: 'Чебурашка', year: 2022, country: 'Россия', director: 'Дмитрий Дьяченко', actors: ['Сергей Гармаш', 'Ольга Кузнецова'], rating: 7.7, budget: '450 000 руб.', boxOffice: '3 000 000 руб.', genre: 'Семейный', poster: 'https://picsum.photos/300/450?random=10', trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Семейная комедия.' }
];

let favorites = [];

const ok = (data) => ({ success: true, data });

// --- Auth (упрощённо) ---
app.post('/auth/login', (req, res) => {
  const { email } = req.body || {};
  const user = { id: 1, email: email || 'user@example.com', name: 'Пользователь', surname: 'Тестовый' };
  res.json(ok(user));
});
app.post('/auth/register', (req, res) => {
  const { email, name, surname } = req.body || {};
  const user = { id: Date.now(), email, name: name || 'Имя', surname: surname || 'Фамилия' };
  res.json(ok(user));
});
app.post('/auth/logout', (_req, res) => res.json(ok(null)));
app.get('/auth/me', (_req, res) => res.json(ok(null)));

// --- Genres ---
app.get('/genres', (_req, res) => {
  res.json(ok(genres));
});

// --- Movies core ---
app.get('/movies', (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const start = (page - 1) * limit;
  const end = start + limit;
  const movies = baseMovies.slice(start, end);
  res.json(ok({ movies, total: baseMovies.length, page, limit }));
});

app.get('/movies/top', (_req, res) => {
  const top = [...baseMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);
  res.json(ok(top));
});

app.get('/movies/random', (_req, res) => {
  const m = baseMovies[Math.floor(Math.random() * baseMovies.length)];
  res.json(ok(m));
});

app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const m = baseMovies.find(x => x.id === id);
  if (!m) return res.status(404).json({ success: false, message: 'Not found' });
  res.json(ok(m));
});

app.get('/movies/genre/:genreId', (req, res) => {
  const genreId = parseInt(req.params.genreId, 10);
  const g = genres.find(x => x.id === genreId);
  const list = g ? baseMovies.filter(m => m.genre === g.name) : [];
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const start = (page - 1) * limit;
  const end = start + limit;
  const movies = list.slice(start, end);
  res.json(ok({ movies, total: list.length, page, limit }));
});

app.get('/movies/search', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const result = !q ? [] : baseMovies.filter(m => m.title.toLowerCase().includes(q));
  res.json(ok(result));
});

// --- Favorites ---
app.get('/favorites', (_req, res) => {
  res.json(ok(favorites));
});
app.post('/favorites/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const m = baseMovies.find(x => x.id === id);
  if (m && !favorites.find(x => x.id === id)) favorites.push(m);
  res.json(ok(null));
});
app.delete('/favorites/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  favorites = favorites.filter(x => x.id !== id);
  res.json(ok(null));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));


