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
    const response: AxiosResponse<Movie[]> = await this.api.get(
      `/movie?genre=${genreId}&page=${page}&count=${limit}`
    );
    return { movies: response.data, total: response.data.length, page, limit };
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const response: AxiosResponse<any[]> = await this.api.get(
      `/movie?title=${encodeURIComponent(query)}`
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
        description: data.plot || '',
        runtime: data.runtime || 0
      };
    });
  }

  // Genres methods
  async getGenres(): Promise<Genre[]> {
    const response: AxiosResponse<string[]> = await this.api.get(
      '/movie/genres'
    );
    return response.data.map((name, index) => ({
      id: index + 1,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    }));
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
