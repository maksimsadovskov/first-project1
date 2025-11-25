import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
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
            <img src={iconHeart} alt="Избранное" width={20} height={20} />
            <span className="tab-btn__text">Избранные фильмы</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <img src={iconPersonaOutline} alt="Настройки" width={20} height={20} />
            <span className="tab-btn__text">Настройки аккаунта</span>
          </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg width="20" height="20" viewBox="88 0 24 24" fill="none">
            <path d="M92 22C92 17.5817 95.5817 14 100 14C104.418 14 108 17.5817 108 22H106C106 18.6863 103.314 16 100 16C96.6863 16 94 18.6863 94 22H92ZM100 13C96.685 13 94 10.315 94 7C94 3.685 96.685 1 100 1C103.315 1 106 3.685 106 7C106 10.315 103.315 13 100 13ZM100 11C102.21 11 104 9.21 104 7C104 4.79 102.21 3 100 3C97.79 3 96 4.79 96 7C96 9.21 97.79 11 100 11Z" fill="white"/>
          </svg>
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
                    <span className="initials">{user.name[0]}{user.surname[0]}</span>
                  </div>
                  <div className="info-text">
                    <div className="info-label">Имя Фамилия</div>
                    <div className="info-value">{user.name} {user.surname}</div>
                  </div>
                </div>
                
                {/* Блок с email */}
                <div className="info-block">
                  <div className="info-icon info-icon--mail">
                    <img src={iconEnvelope} alt="Email" width={24} height={24} />
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
