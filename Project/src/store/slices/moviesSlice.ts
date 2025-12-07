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
      .addCase(fetchMoviesByGenre.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Очищаем предыдущие фильмы при загрузке нового жанра (первая страница)
        if (action.meta.arg.page === 1) {
          state.movies = [];
        }
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action: PayloadAction<MoviesResponse & { genreId: number }>) => {
        state.isLoading = false;
        // Всегда заменяем фильмы на новые (показываем только 15 за раз)
        state.movies = action.payload.movies;
        state.error = null;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Если это первая страница и произошла ошибка, очищаем фильмы
        if (action.meta && action.meta.arg && action.meta.arg.page === 1) {
          state.movies = [];
        }
        console.error('Ошибка загрузки фильмов по жанру:', action.payload);
      })
      // Fetch Genres
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
        state.isLoading = false;
        // Используем изображения из payload (могут быть URL постеров или SVG data URI)
        state.genres = action.payload.map(genre => {
          // Проверяем, что image валидный (может быть data URI или http URL)
          let imageUrl = genre.image || '';
          
          // Если URL не валидный, создаем SVG data URI как fallback
          if (!imageUrl || 
              typeof imageUrl !== 'string' || 
              (!imageUrl.startsWith('data:') && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
            // Создаем SVG placeholder только если нет валидного URL
            const genreColorMap: { [key: string]: string } = {
              'Драма': '4285f4', 'Комедия': '34a853', 'Боевик': 'ea4335', 'Триллер': '9c27b0',
              'Ужасы': 'ff9800', 'Фантастика': '00bcd4', 'Приключения': '4caf50', 'Мультфильмы': 'ff5722',
              'Мультфильм': 'ff5722', 'Мелодрама': 'e91e63', 'Детектив': '607d8b', 'Криминал': '607d8b',
              'Военный': '795548', 'Исторический': '9e9e9e', 'Документальный': '009688', 'Семейный': 'ffc107',
              'Музыка': 'ff4081', 'Вестерн': '8d6e63', 'Стендап': '9c27b0'
            };
            const bgColor = genreColorMap[genre.name] || '666666';
            const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="300" height="200" fill="#${bgColor}"/>
              <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${genre.name}</text>
            </svg>`;
            imageUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
          }
          
          return {
            ...genre,
            image: imageUrl
          };
        });
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
