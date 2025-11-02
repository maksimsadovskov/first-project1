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
    const baseURL = 'http://localhost:3001';
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
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('user');
          window.location.href = '/';
        }
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
    const response: AxiosResponse<ApiResponse<MoviesResponse>> = await this.api.get(
      `/movies?page=${page}&limit=${limit}`
    );
    return response.data.data;
  }

  async getMovieById(id: number): Promise<Movie> {
    const response: AxiosResponse<ApiResponse<Movie>> = await this.api.get(
      `/movies/${id}`
    );
    return response.data.data;
  }

  async getRandomMovie(): Promise<Movie> {
    const response: AxiosResponse<ApiResponse<Movie>> = await this.api.get(
      '/movies/random'
    );
    return response.data.data;
  }

  async getTopMovies(): Promise<Movie[]> {
    const response: AxiosResponse<ApiResponse<Movie[]>> = await this.api.get(
      '/movies/top'
    );
    return response.data.data;
  }

  async getMoviesByGenre(genreId: number, page: number = 1, limit: number = 10): Promise<MoviesResponse> {
    const response: AxiosResponse<ApiResponse<MoviesResponse>> = await this.api.get(
      `/movies/genre/${genreId}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const response: AxiosResponse<ApiResponse<Movie[]>> = await this.api.get(
      `/movies/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  }

  // Genres methods
  async getGenres(): Promise<Genre[]> {
    const response: AxiosResponse<ApiResponse<Genre[]>> = await this.api.get(
      '/genres'
    );
    return response.data.data;
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

export default new ApiService();
