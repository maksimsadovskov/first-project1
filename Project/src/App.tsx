import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuth } from './store/slices/authSlice';
import { fetchGenres, fetchTopMovies, fetchRandomMovie, fetchMovies } from './store/slices/moviesSlice';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Genres from './pages/Genres/Genres';
import GenrePage from './pages/GenrePage/GenrePage';
import MoviePage from './pages/MoviePage/MoviePage';
import AccountPage from './pages/AccountPage/AccountPage';

// Styles
import './App.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication on app start
    dispatch(checkAuth());
    
    // Load initial data
    dispatch(fetchGenres());
    dispatch(fetchTopMovies());
    dispatch(fetchRandomMovie());
    dispatch(fetchMovies({ page: 1, limit: 250 })); // Загружаем фильмы для поиска и страниц
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/genre/:genreId" element={<GenrePage />} />
            <Route path="/movie/:movieId" element={<MoviePage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
