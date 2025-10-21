import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, SearchState } from '../../types';
import apiService from '../../services/api';
import { searchMovies as searchMoviesMock } from '../../data/mockData';

const initialState: SearchState = {
  query: '',
  results: [],
  isSearching: false,
};

// Async thunk
export const searchMovies = createAsyncThunk(
  'search/searchMovies',
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query.trim()) {
        return [];
      }
      // Используем моковые данные для демонстрации
      const results = searchMoviesMock(query);
      return results;
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
