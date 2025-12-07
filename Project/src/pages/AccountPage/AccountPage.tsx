import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser, fetchUser } from '../../store/slices/authSlice';
import { fetchFavorites, removeFromFavorites } from '../../store/slices/moviesSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import './AccountPage.css';
import iconPersonaOutline from '../../assets/icons/icon-persona.svg';
import iconEnvelope from '../../assets/icons/icon-envelop.svg';
import iconHeart from '../../assets/icons/icon-heart.svg';

const AccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites, isLoading } = useAppSelector((state) => state.movies);
  const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');

  useEffect(() => {
    if (isAuthenticated) {
      // Загружаем избранные фильмы
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = (): void => {
    dispatch(logoutUser());
  };

  const handleRemoveFavorite = (movieId: number): void => {
    dispatch(removeFromFavorites(movieId));
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
            <img 
              src={iconHeart} 
              alt="Избранное" 
              width={20} 
              height={20}
              onError={(e) => {
                console.error('Ошибка загрузки iconHeart:', iconHeart);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="tab-btn__text">Избранные фильмы</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <img 
              src={iconPersonaOutline} 
              alt="Настройки" 
              width={20} 
              height={20}
              onError={(e) => {
                console.error('Ошибка загрузки iconPersonaOutline:', iconPersonaOutline);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          <span className="tab-btn__text">Настройки аккаунта</span>
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
                    <MovieCard 
                      key={movie.id} 
                      movie={movie}
                      onRemove={handleRemoveFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="user-info">
                {/* Блок с именем */}
                <div className="info-block">
                  <div className="info-icon info-icon--persona">
                    <span className="initials">
                      {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : ''}
                      {user.surname && user.surname.length > 0 ? user.surname[0].toUpperCase() : ''}
                    </span>
                  </div>
                  <div className="info-text">
                    <div className="info-label">Имя Фамилия</div>
                    <div className="info-value">{user.name} {user.surname}</div>
                  </div>
                </div>
                
                {/* Блок с email */}
                <div className="info-block">
                  <div className="info-icon info-icon--mail">
                    <img 
                      src={iconEnvelope} 
                      alt="Email" 
                      width={24} 
                      height={24}
                      onError={(e) => {
                        console.error('Ошибка загрузки iconEnvelope:', iconEnvelope);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="info-text">
                    <div className="info-label">Электронная почта</div>
                    <div className="info-value">{user.email}</div>
                  </div>
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
