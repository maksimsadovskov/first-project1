import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, Genre, MoviesState, MoviesResponse } from '../../types';
import apiService from '../../services/api';
import { mockMovies, mockGenres, getRandomMovie as getRandomMovieMock, getTopMovies as getTopMoviesMock, getMoviesByGenre as getMoviesByGenreMock } from '../../data/mockData';

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
      // Используем моковые данные для демонстрации
      const movie = getRandomMovieMock();
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
      // Используем моковые данные для демонстрации
      const movies = getTopMoviesMock();
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
      // Используем моковые данные для демонстрации
      const movies = getMoviesByGenreMock(genreId);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMovies = movies.slice(startIndex, endIndex);
      
      return {
        movies: paginatedMovies,
        total: movies.length,
        page,
        limit,
        genreId
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки фильмов по жанру');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      // Используем моковые данные для демонстрации
      return mockGenres;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки жанров');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'movies/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await apiService.getFavorites();
      return favorites;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки избранного');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'movies/addToFavorites',
  async (movieId: number, { rejectWithValue }) => {
    try {
      await apiService.addToFavorites(movieId);
      return movieId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления в избранное');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'movies/removeFromFavorites',
  async (movieId: number, { rejectWithValue }) => {
    try {
      await apiService.removeFromFavorites(movieId);
      return movieId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления из избранного');
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
        const movie = state.movies.find(m => m.id === action.payload);
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
