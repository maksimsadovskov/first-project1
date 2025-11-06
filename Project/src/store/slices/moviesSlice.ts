import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, Genre, MoviesState, MoviesResponse } from '../../types';
import apiService from '../../services/api';
// Removed mockData usage; all data now comes from API

const initialState: MoviesState = {
  movies: [],
  genres: [],
  favorites: [],
  featuredMovie: null,
  topMovies: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await apiService.getMovies(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки фильмов');
    }
  }
);

export const fetchRandomMovie = createAsyncThunk(
  'movies/fetchRandomMovie',
  async (_, { rejectWithValue }) => {
    try {
      const movie = await apiService.getRandomMovie();
      return movie;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки случайного фильма');
    }
  }
);

export const fetchTopMovies = createAsyncThunk(
  'movies/fetchTopMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await apiService.getTopMovies();
      return movies;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки топ фильмов');
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchMoviesByGenre',
  async ({ genreId, page = 1, limit = 10 }: { genreId: number; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await apiService.getMoviesByGenre(genreId, page, limit);
      return { ...response, genreId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки фильмов по жанру');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const genres = await apiService.getGenres();
      return genres as unknown as Genre[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки жанров');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'movies/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      // Локальное хранение избранного (API Skillbox не поддерживает favorites)
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        return JSON.parse(savedFavorites);
      }
      return [];
    } catch (error: any) {
      return rejectWithValue('Ошибка загрузки избранного');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'movies/addToFavorites',
  async (movieId: number, { rejectWithValue, getState }) => {
    try {
      // Локальное хранение избранного (API Skillbox не поддерживает favorites)
      const state: any = getState();
      const movie = state.movies.movies.find((m: Movie) => m.id === movieId) ||
                    state.movies.topMovies.find((m: Movie) => m.id === movieId) ||
                    (state.movies.featuredMovie?.id === movieId ? state.movies.featuredMovie : null);
      
      if (movie) {
        const currentFavorites = state.movies.favorites || [];
        const updatedFavorites = [...currentFavorites, movie];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
      return movieId;
    } catch (error: any) {
      return rejectWithValue('Ошибка добавления в избранное');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'movies/removeFromFavorites',
  async (movieId: number, { rejectWithValue, getState }) => {
    try {
      // Локальное хранение избранного (API Skillbox не поддерживает favorites)
      const state: any = getState();
      const currentFavorites = state.movies.favorites || [];
      const updatedFavorites = currentFavorites.filter((m: Movie) => m.id !== movieId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return movieId;
    } catch (error: any) {
      return rejectWithValue('Ошибка удаления из избранного');
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.featuredMovie = null;
      state.topMovies = [];
    },
    addMoreMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = [...state.movies, ...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<MoviesResponse>) => {
        state.isLoading = false;
        state.movies = action.payload.movies;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Random Movie
      .addCase(fetchRandomMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRandomMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.featuredMovie = action.payload;
        state.error = null;
      })
      .addCase(fetchRandomMovie.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Top Movies
      .addCase(fetchTopMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.topMovies = action.payload;
        state.error = null;
      })
      .addCase(fetchTopMovies.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Movies by Genre
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action: PayloadAction<MoviesResponse & { genreId: number }>) => {
        state.isLoading = false;
        state.movies = action.payload.movies;
        state.error = null;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Genres
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
        state.isLoading = false;
        state.genres = action.payload;
        state.error = null;
      })
      .addCase(fetchGenres.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Favorites
      .addCase(addToFavorites.fulfilled, (state, action: PayloadAction<number>) => {
        const movie = state.movies.find(m => m.id === action.payload) ||
                      state.topMovies.find(m => m.id === action.payload) ||
                      (state.featuredMovie?.id === action.payload ? state.featuredMovie : null);
        if (movie && !state.favorites.find(f => f.id === movie.id)) {
          state.favorites.push(movie);
        }
      })
      // Remove from Favorites
      .addCase(removeFromFavorites.fulfilled, (state, action: PayloadAction<number>) => {
        state.favorites = state.favorites.filter(m => m.id !== action.payload);
      });
  },
});

export const { clearError, clearMovies, addMoreMovies } = moviesSlice.actions;
export default moviesSlice.reducer;
