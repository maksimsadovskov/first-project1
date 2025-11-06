import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterCredentials, AuthState } from '../../types';
import apiService from '../../services/api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isRegistrationSuccess: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Локальная авторизация через localStorage (API Skillbox не поддерживает auth)
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Проверяем только email (пароль не проверяется в локальной версии)
        if (user.email.toLowerCase() === credentials.email.toLowerCase()) {
          // Пересохраняем для обновления данных
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }
      }
      // Если пользователь не найден — создаём нового автоматически
      const newUser: User = {
        id: Date.now(),
        email: credentials.email,
        name: 'Пользователь',
        surname: 'Тестовый'
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (error: any) {
      return rejectWithValue('Ошибка входа');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      // Локальная регистрация (API Skillbox не поддерживает auth)
      const user: User = {
        id: Date.now(),
        email: credentials.email,
        name: credentials.name,
        surname: credentials.surname
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Локальный выход (API Skillbox не поддерживает auth)
      localStorage.removeItem('user');
      localStorage.removeItem('favorites');
      return null;
    } catch (error: any) {
      return rejectWithValue('Ошибка выхода');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Optionally verify with server
        return user;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue('Ошибка проверки авторизации');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setRegistrationSuccess: (state, action: PayloadAction<boolean>) => {
      state.isRegistrationSuccess = action.payload;
    },
    clearRegistrationSuccess: (state) => {
      state.isRegistrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isRegistrationSuccess = true;
        state.error = null;
        // Не устанавливаем пользователя как авторизованного сразу
        // state.user = action.payload;
        // state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearAuth, setRegistrationSuccess, clearRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;
