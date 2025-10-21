// User types
export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRegistrationSuccess: boolean;
}

// Movie types
export interface Movie {
  id: number;
  title: string;
  year: number;
  country: string;
  director: string;
  actors: string[];
  rating: number;
  budget: string;
  boxOffice: string;
  genre: string;
  poster: string;
  trailer: string;
  description?: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

// Movies state
export interface MoviesState {
  movies: Movie[];
  genres: Genre[];
  favorites: Movie[];
  featuredMovie: Movie | null;
  topMovies: Movie[];
  isLoading: boolean;
  error: string | null;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
}

// Search types
export interface SearchState {
  query: string;
  results: Movie[];
  isSearching: boolean;
}

// Modal types
export interface ModalState {
  isAuthModalOpen: boolean;
  isSearchModalOpen: boolean;
  isTrailerModalOpen: boolean;
  trailerUrl: string;
}

// Root state
export interface RootState {
  auth: AuthState;
  movies: MoviesState;
  search: SearchState;
  modal: ModalState;
}
