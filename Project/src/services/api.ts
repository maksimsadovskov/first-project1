import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  Movie, 
  Genre, 
  ApiResponse,
  MoviesResponse 
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = process.env.REACT_APP_API_URL || 'https://cinemaguide.skillbox.cc';
    this.api = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Не редиректим при 401, т.к. используем локальную авторизацию
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
      '/auth/login',
      credentials
    );
    return response.data.data;
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
      '/auth/register',
      credentials
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(
      '/auth/me'
    );
    return response.data.data;
  }

  // Movies methods
  async getMovies(page: number = 1, limit: number = 10): Promise<MoviesResponse> {
    const response: AxiosResponse<any[]> = await this.api.get(
      `/movie?page=${page}&count=${limit}`
    );
    const movies = response.data.map((data: any) => {
      const firstGenre = data.genres?.[0] || '';
      return {
        id: data.id,
        title: data.title || data.originalTitle,
        year: data.releaseYear,
        country: data.countriesOfOrigin?.[0] || '',
        director: data.director || '',
        actors: data.cast || [],
        rating: data.tmdbRating || 0,
        budget: data.budget ? `${data.budget}` : '',
        boxOffice: data.revenue ? `${data.revenue}` : '',
        genre: this.mapGenreToRussian(firstGenre),
        poster: data.posterUrl || data.backdropUrl || '',
        trailer: data.trailerYouTubeId ? `https://www.youtube.com/embed/${data.trailerYouTubeId}` : '',
        description: data.plot || ''
      };
    });
    return { movies, total: movies.length, page, limit };
  }

  async getMovieById(id: number): Promise<Movie> {
    const response: AxiosResponse<any> = await this.api.get(
      `/movie/${id}`
    );
    const data = response.data;
    const firstGenre = data.genres?.[0] || '';
    return {
      id: data.id,
      title: data.title || data.originalTitle,
      year: data.releaseYear,
      country: data.countriesOfOrigin?.[0] || '',
      director: data.director || '',
      actors: data.cast || [],
      rating: data.tmdbRating || 0,
      budget: data.budget ? `${data.budget}` : '',
      boxOffice: data.revenue ? `${data.revenue}` : '',
      genre: this.mapGenreToRussian(firstGenre),
      poster: data.posterUrl || data.backdropUrl || '',
      trailer: data.trailerYouTubeId ? `https://www.youtube.com/embed/${data.trailerYouTubeId}` : '',
      description: data.plot || '',
      runtime: data.runtime || 0
    };
  }

  private mapGenreToRussian(genre: string): string {
    const genreMap: { [key: string]: string } = {
      'action': 'боевик',
      'adventure': 'приключения',
      'comedy': 'комедия',
      'drama': 'драма',
      'fantasy': 'фантастика',
      'horror': 'ужасы',
      'mystery': 'детектив',
      'romance': 'мелодрама',
      'thriller': 'триллер',
      'western': 'вестерн',
      'animation': 'мультфильм',
      'documentary': 'документальный',
      'crime': 'криминал',
      'family': 'семейный',
      'music': 'музыка',
      'war': 'военный',
      'history': 'исторический',
      'science fiction': 'фантастика',
      'sci-fi': 'фантастика'
    };
    return genreMap[genre.toLowerCase()] || genre;
  }

  async getRandomMovie(): Promise<Movie> {
    const response: AxiosResponse<any> = await this.api.get(
      '/movie/random'
    );
    const data = response.data;
    const firstGenre = data.genres?.[0] || '';
    return {
      id: data.id,
      title: data.title || data.originalTitle,
      year: data.releaseYear,
      country: data.countriesOfOrigin?.[0] || '',
      director: data.director || '',
      actors: data.cast || [],
      rating: data.tmdbRating || 0,
      budget: data.budget ? `${data.budget}` : '',
      boxOffice: data.revenue ? `${data.revenue}` : '',
      genre: this.mapGenreToRussian(firstGenre),
      poster: data.posterUrl || data.backdropUrl || '',
      trailer: data.trailerYouTubeId ? `https://www.youtube.com/embed/${data.trailerYouTubeId}` : '',
      description: data.plot || ''
    };
  }

  async getTopMovies(): Promise<Movie[]> {
    const response: AxiosResponse<any[]> = await this.api.get(
      '/movie/top10'
    );
    return response.data.map((data: any) => {
      const firstGenre = data.genres?.[0] || '';
      return {
        id: data.id,
        title: data.title || data.originalTitle,
        year: data.releaseYear,
        country: data.countriesOfOrigin?.[0] || '',
        director: data.director || '',
        actors: data.cast || [],
        rating: data.tmdbRating || 0,
        budget: data.budget ? `${data.budget}` : '',
        boxOffice: data.revenue ? `${data.revenue}` : '',
        genre: this.mapGenreToRussian(firstGenre),
        poster: data.posterUrl || data.backdropUrl || '',
        trailer: data.trailerYouTubeId ? `https://www.youtube.com/embed/${data.trailerYouTubeId}` : '',
        description: data.plot || ''
      };
    });
  }

  async getMoviesByGenre(genreId: number, page: number = 1, limit: number = 10): Promise<MoviesResponse> {
    try {
      // Пробуем разные варианты запроса
      let response: AxiosResponse<any[]>;
      let movies: any[] = [];
      
      const attempts = [
        () => this.api.get(`/movie?genre=${genreId}&page=${page}&count=${limit}`),
        () => this.api.get(`/movie?genre=${genreId}&page=${page}`),
        () => this.api.get(`/movie?genre=${genreId}`),
        () => this.api.get(`/movie?page=${page}&count=${limit * 2}`) // Запрашиваем больше фильмов для фильтрации
      ];
      
      for (const attempt of attempts) {
        try {
          response = await attempt();
          if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
            movies = response.data;
            console.log(`Найдено ${movies.length} фильмов для жанра ID ${genreId} (попытка ${attempts.indexOf(attempt) + 1})`);
            break;
          }
        } catch (err) {
          console.warn(`Попытка загрузки фильмов по жанру ${genreId} не удалась:`, err);
          continue;
        }
      }
      
      // Если не нашли через запрос по жанру, пробуем найти среди всех фильмов
      if (movies.length === 0) {
        try {
          console.log(`Не найдено фильмов через запрос по жанру, ищем среди всех фильмов...`);
          // Запрашиваем только необходимое количество + небольшой запас для фильтрации
          const requestCount = limit * 5; // Запрашиваем в 5 раз больше для фильтрации
          const allMoviesResponse = await this.api.get(`/movie?page=1&count=${requestCount}`);
          if (allMoviesResponse && allMoviesResponse.data && Array.isArray(allMoviesResponse.data)) {
            // Получаем название жанра по ID
            const genresResponse = await this.api.get('/movie/genres');
            const genreNames = genresResponse.data || [];
            const genreName = genreNames[genreId - 1] || '';
            const russianGenreName = this.mapGenreToRussian(genreName);
            
            // Фильтруем фильмы по жанру
            const filteredMovies = allMoviesResponse.data.filter((movie: any) => {
              if (!movie.genres || !Array.isArray(movie.genres)) return false;
              const movieGenres = movie.genres.map((g: string) => this.mapGenreToRussian(g.toLowerCase()));
              return movieGenres.includes(russianGenreName) || movieGenres.some((g: string) => 
                g.toLowerCase().includes(genreName.toLowerCase())
              );
            });
            
            // Применяем пагинацию - берем только нужное количество для текущей страницы
            const start = (page - 1) * limit;
            const end = start + limit;
            movies = filteredMovies.slice(start, end);
            
            console.log(`Найдено ${movies.length} фильмов жанра "${russianGenreName}" среди всех фильмов (из ${filteredMovies.length} отфильтрованных, страница ${page})`);
          }
        } catch (err) {
          console.error(`Ошибка при поиске фильмов среди всех:`, err);
        }
      } else {
        // Если нашли через запрос по жанру, ограничиваем до нужного количества
        const start = (page - 1) * limit;
        const end = start + limit;
        movies = movies.slice(start, end);
        console.log(`Ограничено до ${movies.length} фильмов для страницы ${page}`);
      }
      
      const mappedMovies = movies.map((data: any) => {
        const firstGenre = data.genres?.[0] || '';
        // Используем posterUrl, backdropUrl или placeholder
        let poster = data.posterUrl || data.backdropUrl || '';
        // Если постер пустой, используем placeholder
        if (!poster || poster.trim() === '') {
          poster = `https://picsum.photos/300/450?random=${data.id}`;
        }
        return {
          id: data.id,
          title: data.title || data.originalTitle,
          year: data.releaseYear,
          country: data.countriesOfOrigin?.[0] || '',
          director: data.director || '',
          actors: data.cast || [],
          rating: data.tmdbRating || 0,
          budget: data.budget ? `${data.budget}` : '',
          boxOffice: data.revenue ? `${data.revenue}` : '',
          genre: this.mapGenreToRussian(firstGenre),
          poster: poster,
          trailer: data.trailerYouTubeId ? `https://www.youtube.com/embed/${data.trailerYouTubeId}` : '',
          description: data.plot || '',
          runtime: data.runtime || 0
        };
      });
      
      return { movies: mappedMovies, total: mappedMovies.length, page, limit };
    } catch (error: any) {
      console.error(`Ошибка загрузки фильмов по жанру ${genreId}:`, error);
      return { movies: [], total: 0, page, limit };
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response: AxiosResponse<any[]> = await this.api.get(
        `/movie?title=${encodeURIComponent(query)}`
      );
      
      // Проверяем, что response.data существует и является массивом
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('API search returned invalid data:', response.data);
        return [];
      }
      
      // Если массив пустой, возвращаем пустой массив
      if (response.data.length === 0) {
        console.log('API search returned no results for query:', query);
        return [];
      }
      
      return response.data.map((data: any) => {
        const firstGenre = data.genres?.[0] || '';
        return {
          id: data.id,
          title: data.title || data.originalTitle,
          year: data.releaseYear,
          country: data.countriesOfOrigin?.[0] || '',
          director: data.director || '',
          actors: data.cast || [],
          rating: data.tmdbRating || 0,
          budget: data.budget ? `${data.budget}` : '',
          boxOffice: data.revenue ? `${data.revenue}` : '',
          genre: this.mapGenreToRussian(firstGenre),
          poster: data.posterUrl || data.backdropUrl || '',
          trailer: data.trailerYouTubeId ? `https://www.youtube.com/embed/${data.trailerYouTubeId}` : '',
          description: data.plot || '',
          runtime: data.runtime || 0
        };
      });
    } catch (error: any) {
      console.error('API search error:', error);
      // Возвращаем пустой массив вместо выброса ошибки
      return [];
    }
  }

  // Genres methods
  async getGenres(): Promise<Genre[]> {
    const response: AxiosResponse<string[]> = await this.api.get(
      '/movie/genres'
    );
    
    // Маппинг английских названий на русские
    const genreNameMap: { [key: string]: string } = {
      'drama': 'Драма',
      'comedy': 'Комедия',
      'action': 'Боевик',
      'thriller': 'Триллер',
      'horror': 'Ужасы',
      'fantasy': 'Фантастика',
      'adventure': 'Приключения',
      'animation': 'Мультфильмы',
      'romance': 'Мелодрама',
      'mystery': 'Детектив',
      'crime': 'Криминал',
      'war': 'Военный',
      'history': 'Исторический',
      'documentary': 'Документальный',
      'family': 'Семейный',
      'music': 'Музыка',
      'western': 'Вестерн',
      'sci-fi': 'Фантастика',
      'scifi': 'Фантастика',
      'science fiction': 'Фантастика',
      'stand-up': 'Стендап',
      'standup': 'Стендап'
    };
    
    // Функция для создания SVG placeholder через data URI
    const createPlaceholderImage = (text: string, bgColor: string = '666666', textColor: string = 'ffffff'): string => {
      const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
      </svg>`;
      // Используем btoa для кодирования base64 в браузере
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    };
    
    // Маппинг цветов для жанров
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
    
    // Загружаем постер первого фильма для каждого жанра
    const genresWithImages = await Promise.allSettled(
      response.data.map(async (name, index) => {
        // Преобразуем английское название в русское
        const lowerName = name.toLowerCase().trim();
        const russianName = genreNameMap[lowerName] || name;
        const genreId = index + 1;
        
        let imageUrl = '';
        
        try {
          // Пытаемся получить фильмы из жанра (пробуем разные варианты запроса)
          let moviesResponse;
          let foundMovie = null;
          
          // Сначала пробуем запрос по жанру с разными параметрами
          const attempts = [
            () => this.api.get(`/movie?genre=${genreId}&page=1&count=50`),
            () => this.api.get(`/movie?genre=${genreId}&page=1&count=30`),
            () => this.api.get(`/movie?genre=${genreId}&page=1&count=20`),
            () => this.api.get(`/movie?genre=${genreId}&page=1`),
            () => this.api.get(`/movie?genre=${genreId}`)
          ];
          
          for (const attempt of attempts) {
            try {
              moviesResponse = await attempt();
              if (moviesResponse && moviesResponse.data && Array.isArray(moviesResponse.data) && moviesResponse.data.length > 0) {
                foundMovie = moviesResponse.data[0];
                break;
              }
            } catch (err) {
              continue;
            }
          }
          
          // Если не нашли через запрос по жанру, пробуем найти среди всех фильмов
          if (!foundMovie) {
            try {
              // Запрашиваем много фильмов и ищем среди них фильм нужного жанра
              const allMoviesResponse = await this.api.get(`/movie?page=1&count=100`);
              if (allMoviesResponse && allMoviesResponse.data && Array.isArray(allMoviesResponse.data)) {
                // Ищем фильм с нужным жанром (проверяем по genres массиву)
                foundMovie = allMoviesResponse.data.find((movie: any) => {
                  if (!movie.genres || !Array.isArray(movie.genres)) return false;
                  // Проверяем, есть ли в жанрах фильма нужный жанр
                  const movieGenres = movie.genres.map((g: string) => g.toLowerCase());
                  const targetGenre = name.toLowerCase();
                  return movieGenres.includes(targetGenre);
                });
              }
            } catch (err) {
              console.warn(`Не удалось загрузить все фильмы для поиска жанра ${russianName}:`, err);
            }
          }
          
          if (foundMovie) {
            // Проверяем наличие постеров
            imageUrl = foundMovie.posterUrl || foundMovie.backdropUrl || '';
            
            // Логируем для отладки
            if (imageUrl) {
              console.log(`Постер для жанра ${russianName} (ID: ${genreId}):`, imageUrl);
            } else {
              console.warn(`Постер не найден для жанра ${russianName} (ID: ${genreId}), фильм:`, foundMovie);
            }
            
            // Проверяем, что URL валидный
            if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
              // URL валидный, используем его
            } else {
              imageUrl = '';
            }
          } else {
            console.warn(`Нет фильмов для жанра ${russianName} (ID: ${genreId})`);
          }
        } catch (error: any) {
          // Если не удалось загрузить фильм, используем placeholder
          console.warn(`Не удалось загрузить фильм для жанра ${russianName} (ID: ${genreId}):`, error?.message || error);
          imageUrl = '';
        }
        
        // Если постер не найден, используем SVG placeholder
        if (!imageUrl || imageUrl.trim() === '') {
          const bgColor = genreColorMap[russianName] || '666666';
          imageUrl = createPlaceholderImage(russianName, bgColor, 'ffffff');
        }
        
        return {
          id: genreId,
          name: russianName,
          slug: lowerName.replace(/\s+/g, '-'),
          image: imageUrl
        };
      })
    );
    
    // Обрабатываем результаты Promise.allSettled
    return genresWithImages.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // Если произошла ошибка, создаем жанр с placeholder
        const name = response.data[index];
        const lowerName = name.toLowerCase().trim();
        const russianName = genreNameMap[lowerName] || name;
        const bgColor = genreColorMap[russianName] || '666666';
        return {
          id: index + 1,
          name: russianName,
          slug: lowerName.replace(/\s+/g, '-'),
          image: createPlaceholderImage(russianName, bgColor, 'ffffff')
        };
      }
    });
  }

  // Favorites methods
  async getFavorites(): Promise<Movie[]> {
    const response: AxiosResponse<ApiResponse<Movie[]>> = await this.api.get(
      '/favorites'
    );
    return response.data.data;
  }

  async addToFavorites(movieId: number): Promise<void> {
    await this.api.post(`/favorites/${movieId}`);
  }

  async removeFromFavorites(movieId: number): Promise<void> {
    await this.api.delete(`/favorites/${movieId}`);
  }
}

const apiService = new ApiService();

export default apiService;
