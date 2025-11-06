import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, SearchState } from '../../types';
import apiService from '../../services/api';
// Removed mockData usage; using API search

const initialState: SearchState = {
  query: '',
  results: [],
  isSearching: false,
};

// Async thunk
export const searchMovies = createAsyncThunk(
  'search/searchMovies',
  async (query: string, { rejectWithValue, getState }) => {
    try {
      if (!query.trim()) {
        return [];
      }
      
      const lowerQuery = query.toLowerCase();
      const state: any = getState();
      const allMovies = [
        ...(state.movies?.movies || []),
        ...(state.movies?.topMovies || []),
        ...(state.movies?.featuredMovie ? [state.movies.featuredMovie] : [])
      ];
      
      // Клиентский поиск по загруженным фильмам (поддержка русских названий)
      const clientResults = allMovies.filter((movie: any) => 
        movie.title?.toLowerCase().includes(lowerQuery)
      );
      
      // Если нашли на клиенте или запрос на русском — возвращаем клиентские результаты
      if (clientResults.length > 0 || /[а-яА-ЯЁё]/.test(query)) {
        return clientResults;
      }
      
      // Иначе пробуем API (для английских названий)
      try {
        const apiResults = await apiService.searchMovies(query);
        return apiResults;
      } catch {
        return clientResults;
      }
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
