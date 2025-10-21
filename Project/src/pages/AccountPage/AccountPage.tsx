import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { fetchFavorites } from '../../store/slices/moviesSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import './AccountPage.css';

const AccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites, isLoading } = useAppSelector((state) => state.movies);
  const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = (): void => {
    dispatch(logoutUser());
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="account-page-error">
        <h1>Доступ запрещен</h1>
        <p>Для просмотра этой страницы необходимо войти в аккаунт.</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <h1 className="account-title">Мой аккаунт</h1>
        </div>

        <div className="account-tabs">
          <button 
            className={`tab-btn ${activeTab === 'favorites' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Избранные фильмы
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Настройки аккаунта
          </button>
        </div>

        <div className="account-content">
          {activeTab === 'favorites' && (
            <div className="favorites-section">
              <h2 className="section-title">Избранные фильмы</h2>
              
              {isLoading ? (
                <div className="favorites-loading">
                  <div className="loading-spinner">Загрузка...</div>
                </div>
              ) : favorites.length === 0 ? (
                <div className="empty-favorites">
                  <p>У вас пока нет избранных фильмов.</p>
                  <p>Добавьте фильмы в избранное, нажав на кнопку ♥ на карточке фильма.</p>
                </div>
              ) : (
                <div className="favorites-grid">
                  {favorites.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2 className="section-title">Настройки аккаунта</h2>
              
              <div className="user-info">
                <div className="info-item">
                  <label className="info-label">Имя:</label>
                  <span className="info-value">{user.name}</span>
                </div>
                
                <div className="info-item">
                  <label className="info-label">Фамилия:</label>
                  <span className="info-value">{user.surname}</span>
                </div>
                
                <div className="info-item">
                  <label className="info-label">Email:</label>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>
              
              <div className="account-actions">
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
