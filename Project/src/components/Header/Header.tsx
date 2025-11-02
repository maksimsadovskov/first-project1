import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { openAuthModal, openSearchModal, closeSearchModal, closeAuthModal } from '../../store/slices/modalSlice';
import SearchModal from '../SearchModal/SearchModal';
import AuthModal from '../AuthModal/AuthModal';
import './Header.css';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isSearchModalOpen, isAuthModalOpen } = useAppSelector((state) => state.modal);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginClick = (): void => {
    dispatch(openAuthModal());
  };

  const handleAccountClick = (): void => {
    if (isAuthenticated && user) {
      navigate('/account');
    } else {
      dispatch(openAuthModal());
    }
  };

  const handleLogout = (): void => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleSearchClick = (): void => {
    dispatch(openSearchModal());
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon"></div>
          <span>маруся</span>
        </Link>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="burger-icon">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>

            <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`}>
              <Link to="/" className="nav-link">
                Главная
              </Link>
              <Link to="/genres" className="nav-link">
                Жанры
              </Link>
            </nav>

            <div className="header-actions">
              <button 
                className="search-btn"
                onClick={handleSearchClick}
                aria-label="Поиск"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {isAuthenticated && user ? (
                <button 
                  className="user-btn"
                  onClick={handleAccountClick}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <button 
                  className="login-btn"
                  onClick={handleLoginClick}
                >
                  <span className="login-text">Войти</span>
                  <svg className="login-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => dispatch(closeSearchModal())}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(closeAuthModal())}
      />
    </>
  );
};

export default Header;
