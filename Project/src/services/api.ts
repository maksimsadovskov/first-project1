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
      const genresResponse = await this.api.get('/movie/genres');
      const genreNames = genresResponse.data || [];
      const genreName = genreNames[genreId - 1] || '';
      
      const collectGenrePages = async (): Promise<any[]> => {
        const collected: any[] = [];
        for (let p = 1; p <= 5; p++) {
          try {
            const resp = await this.api.get(`/movie?genre=${encodeURIComponent(genreName)}&page=${p}&count=200`);
            if (resp && Array.isArray(resp.data) && resp.data.length > 0) {
              collected.push(...resp.data);
              if (resp.data.length < 200) break;
            } else {
              break;
            }
          } catch (err) {
            break;
          }
        }
        return collected;
      };
      
      const directMovies = await collectGenrePages();
      
      let filteredMovies: any[] = [];
      try {
        const requestCount = 4000;
        const allMoviesResponse = await this.api.get(`/movie?page=1&count=${requestCount}`);
        if (allMoviesResponse && Array.isArray(allMoviesResponse.data)) {
          const russianGenreName = this.mapGenreToRussian(genreName);
          
          const russianToEnglishMap: { [key: string]: string[] } = {
            'Драма': ['drama'],
            'Комедия': ['comedy'],
            'Боевик': ['action'],
            'Триллер': ['thriller'],
            'Ужасы': ['horror'],
            'Фантастика': ['fantasy', 'science fiction', 'sci-fi'],
            'Приключения': ['adventure'],
            'Мультфильмы': ['animation'],
            'Мелодрама': ['romance'],
            'Детектив': ['mystery'],
            'Криминал': ['crime'],
            'Военный': ['war'],
            'Исторический': ['history', 'historical'],
            'Документальный': ['documentary'],
            'Семейный': ['family'],
            'Музыка': ['music'],
            'Вестерн': ['western'],
            'Стендап': ['stand-up', 'standup']
          };
          
          const searchTerms: string[] = [russianGenreName.toLowerCase(), genreName.toLowerCase()];
          if (russianToEnglishMap[russianGenreName]) {
            searchTerms.push(...russianToEnglishMap[russianGenreName]);
          }
          
          const normalizedTerms = searchTerms
            .filter(Boolean)
            .map(t => t.toLowerCase().trim())
            .flatMap(t => {
              const clean = t.replace(/\s+/g, '');
              return clean ? [t, clean] : [t];
            });
          
          filteredMovies = allMoviesResponse.data.filter((movie: any) => {
            if (!movie.genres || !Array.isArray(movie.genres)) return false;
            
            const movieGenresLower = movie.genres
              .filter((g: string) => typeof g === 'string')
              .map((g: string) => g.toLowerCase().trim());
            const movieGenresClean = movieGenresLower.map((g: string) => g.replace(/\s+/g, ''));
            const movieGenresRussian = movie.genres
              .filter((g: string) => typeof g === 'string')
              .map((g: string) => this.mapGenreToRussian(g.toLowerCase().trim()));
            const movieGenresRussianClean = movieGenresRussian.map((g: string) => g.replace(/\s+/g, ''));
            
            for (const term of normalizedTerms) {
              if (
                movieGenresLower.includes(term) ||
                movieGenresRussian.includes(term) ||
                movieGenresClean.includes(term) ||
                movieGenresRussianClean.includes(term) ||
                movieGenresLower.some((g: string) => g.includes(term)) ||
                movieGenresRussian.some((g: string) => g.includes(term)) ||
                movieGenresClean.some((g: string) => g.includes(term)) ||
                movieGenresRussianClean.some((g: string) => g.includes(term)) ||
                term.includes(movieGenresLower[0] || '') ||
                term.includes(movieGenresRussian[0] || '')
              ) {
                return true;
              }
            }
            
            return false;
          });
        }
      } catch (err) {
      }
      
      const combinedUnique: any[] = [];
      const seenIds = new Set<number>();
      const pushUnique = (items: any[]) => {
        for (const m of items) {
          if (!seenIds.has(m.id)) {
            seenIds.add(m.id);
            combinedUnique.push(m);
          }
        }
      };
      
      pushUnique(directMovies);
      pushUnique(filteredMovies);
      
      const total = combinedUnique.length;
      const start = page === 1 ? 0 : 15 + (page - 2) * limit;
      const end = page === 1 ? 15 : start + limit;
      const pageMovies = combinedUnique.slice(start, end);
      
      const mappedMovies = pageMovies.map((data: any) => {
        const firstGenre = data.genres?.[0] || '';
        let poster = data.posterUrl || data.backdropUrl || '';
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
      
      return { movies: mappedMovies, total, page, limit };
    } catch (error: any) {
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
        return [];
      }
      
      if (response.data.length === 0) {
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
    
    // Оптимизация: загружаем все фильмы один раз для поиска постеров
    let allMoviesCache: any[] = [];
    try {
      const allMoviesResponse = await this.api.get(`/movie?page=1&count=200`);
      if (allMoviesResponse && allMoviesResponse.data && Array.isArray(allMoviesResponse.data)) {
        allMoviesCache = allMoviesResponse.data;
      }
    } catch (err) {
    }
    
    const genresWithImages = await Promise.allSettled(
      response.data.map(async (name, index) => {
        const lowerName = name.toLowerCase().trim();
        const russianName = genreNameMap[lowerName] || name;
        const genreId = index + 1;
        
        let imageUrl = '';
        let foundMovie = null;
        
        try {
          // Сначала пробуем найти в кэше всех фильмов
          if (allMoviesCache.length > 0) {
            foundMovie = allMoviesCache.find((movie: any) => {
              if (!movie.genres || !Array.isArray(movie.genres)) return false;
              const movieGenres = movie.genres.map((g: string) => g.toLowerCase());
              const targetGenre = name.toLowerCase();
              return movieGenres.includes(targetGenre);
            });
          }
          
          // Если не нашли в кэше, пробуем один запрос по жанру
          if (!foundMovie) {
            try {
              const moviesResponse = await this.api.get(`/movie?genre=${genreId}&page=1&count=10`);
              if (moviesResponse && moviesResponse.data && Array.isArray(moviesResponse.data) && moviesResponse.data.length > 0) {
                foundMovie = moviesResponse.data[0];
              }
            } catch (err) {
              // Игнорируем ошибку, используем placeholder
            }
          }
          
          if (foundMovie) {
            // Проверяем наличие постеров
            imageUrl = foundMovie.posterUrl || foundMovie.backdropUrl || '';
            
            // Проверяем, что URL валидный
            if (!imageUrl || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
              imageUrl = '';
            }
          }
        } catch (error: any) {
          // Если не удалось загрузить фильм, используем placeholder
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
