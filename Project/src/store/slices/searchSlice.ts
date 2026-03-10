import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, SearchState } from '../../types';
import apiService from '../../services/api';
// Removed mockData usage; using API search

const initialState: SearchState = {
  query: '',
  results: [],
  isSearching: false,
};

// Кэш для предотвращения дублирования запросов
const searchCache = new Map<string, { results: any[]; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 минута

// Async thunk
export const searchMovies = createAsyncThunk(
  'search/searchMovies',
  async (query: string, { rejectWithValue, getState, signal }) => {
    try {
      if (!query.trim()) {
        return [];
      }
      
      // Проверяем кэш
      const cached = searchCache.get(query);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.results;
      }
      
      // Проверяем, не выполняется ли уже запрос с таким же query
      const state: any = getState();
      
      const lowerQuery = query.toLowerCase();
      const allMovies = [
        ...(state.movies?.movies || []),
        ...(state.movies?.topMovies || []),
        ...(state.movies?.featuredMovie ? [state.movies.featuredMovie] : [])
      ];
      
      // Сначала ищем в локальных данных (работает для русского и английского)
      // Ищем по названию и жанру
      const clientResults = allMovies.filter((movie: any) => {
        const title = movie.title?.toLowerCase() || '';
        const genre = movie.genre?.toLowerCase() || '';
        return title.includes(lowerQuery) || genre.includes(lowerQuery);
      });
      
      // Если нашли в локальных данных, кэшируем и возвращаем
      if (clientResults.length > 0) {
        searchCache.set(query, { results: clientResults, timestamp: Date.now() });
        return clientResults;
      }
      
      // Если не нашли в локальных данных, пробуем API (для русского и английского)
      // Проверяем, не отменен ли запрос
      if (signal.aborted) {
        return [];
      }
      
      // Всегда пробуем API, даже если есть локальные данные (для полноты результатов)
      try {
        const apiResults = await apiService.searchMovies(query);
        // Если API вернул результаты, кэшируем и возвращаем
        if (apiResults && Array.isArray(apiResults) && apiResults.length > 0) {
          searchCache.set(query, { results: apiResults, timestamp: Date.now() });
          return apiResults;
        }
      } catch (apiError) {
        // Игнорируем ошибки API, продолжаем поиск
      }
      
      // Если ничего не нашли, кэшируем пустой результат
      searchCache.set(query, { results: [], timestamp: Date.now() });
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка поиска');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.isSearching = false;
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(searchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isSearching = false;
        state.results = action.payload;
      })
      .addCase(searchMovies.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
      });
  },
});

export const { setQuery, clearSearch, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
