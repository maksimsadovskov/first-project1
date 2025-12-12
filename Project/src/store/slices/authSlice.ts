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
      // Пытаемся войти через API
      try {
        const user = await apiService.login(credentials);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (apiError: any) {
        // При любой ошибке от API (400, 404 и т.д.) используем локальную авторизацию
        // Используем локальную авторизацию
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
      }
    } catch (error: any) {
      // При любой ошибке используем локальную авторизацию
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.email.toLowerCase() === credentials.email.toLowerCase()) {
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }
        
        // Используем локальную авторизацию
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
      }
      // Создаём нового пользователя
      const newUser: User = {
        id: Date.now(),
        email: credentials.email,
        name: 'Пользователь',
        surname: 'Тестовый'
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      // Пытаемся зарегистрироваться через API
      try {
        const user = await apiService.register(credentials);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (apiError: any) {
        // При любой ошибке от API (400, 404 и т.д.) используем локальную регистрацию
        const user: User = {
          id: Date.now(),
          email: credentials.email,
          name: credentials.name,
          surname: credentials.surname
        };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
    } catch (error: any) {
      // При любой ошибке используем локальную регистрацию
      const user: User = {
        id: Date.now(),
        email: credentials.email,
        name: credentials.name,
        surname: credentials.surname
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
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

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      // Пытаемся получить данные пользователя через API
      const user = await apiService.getCurrentUser();
      // Сохраняем в localStorage для синхронизации
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      // Если API не доступен (404), используем данные из localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return user;
      }
      // Не возвращаем ошибку, чтобы не блокировать работу приложения
      return rejectWithValue(null);
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
        // Пользователь должен войти вручную после регистрации
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        // Ошибки от API обрабатываются через локальную регистрацию, не показываем их
        state.error = null;
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
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAuth, setRegistrationSuccess, clearRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;
