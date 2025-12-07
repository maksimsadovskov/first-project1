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
      
      console.log('Search query:', query, 'Total movies in store:', allMovies.length);
      
      // Сначала ищем в локальных данных (работает для русского и английского)
      // Ищем по названию и жанру
      const clientResults = allMovies.filter((movie: any) => {
        const title = movie.title?.toLowerCase() || '';
        const genre = movie.genre?.toLowerCase() || '';
        const matches = title.includes(lowerQuery) || genre.includes(lowerQuery);
        if (matches) {
          console.log('Found match in local:', movie.title, 'genre:', movie.genre);
        }
        return matches;
      });
      
      // Если нашли в локальных данных, возвращаем их
      if (clientResults.length > 0) {
        console.log('Local search found results:', clientResults.length);
        return clientResults;
      }
      
      // Если не нашли в локальных данных, пробуем API (для русского и английского)
      try {
        const apiResults = await apiService.searchMovies(query);
        // Если API вернул результаты, возвращаем их
        if (apiResults && Array.isArray(apiResults) && apiResults.length > 0) {
          console.log('API search found results:', apiResults.length);
          return apiResults;
        } else {
          console.log('API search returned no results');
        }
      } catch (apiError) {
        console.warn('API search failed:', apiError);
      }
      
      // Если ничего не нашли, возвращаем пустой массив
      console.log('No results found for query:', query);
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
