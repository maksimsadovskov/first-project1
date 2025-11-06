import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { openAuthModal, closeAuthModal } from '../../store/slices/modalSlice';
import HeaderSearch from '../HeaderSearch/HeaderSearch';
import MobileSearchModal from '../MobileSearchModal/MobileSearchModal';
import AuthModal from '../AuthModal/AuthModal';
import './Header.css';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isAuthModalOpen } = useAppSelector((state) => state.modal);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.nav') && !target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
              <svg className="grid-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7C11.5 9.48528 9.48528 11.5 7 11.5ZM7 21.5C4.51472 21.5 2.5 19.4853 2.5 17C2.5 14.5147 4.51472 12.5 7 12.5C9.48528 12.5 11.5 14.5147 11.5 17C11.5 19.4853 9.48528 21.5 7 21.5ZM17 11.5C14.5147 11.5 12.5 9.48528 12.5 7C12.5 4.51472 14.5147 2.5 17 2.5C19.4853 2.5 21.5 4.51472 21.5 7C21.5 9.48528 19.4853 11.5 17 11.5ZM17 21.5C14.5147 21.5 12.5 19.4853 12.5 17C12.5 14.5147 14.5147 12.5 17 12.5C19.4853 12.5 21.5 14.5147 21.5 17C21.5 19.4853 19.4853 21.5 17 21.5ZM7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5ZM7 19.5C8.38071 19.5 9.5 18.3807 9.5 17C9.5 15.6193 8.38071 14.5 7 14.5C5.61929 14.5 4.5 15.6193 4.5 17C4.5 18.3807 5.61929 19.5 7 19.5ZM17 9.5C18.3807 9.5 19.5 8.38071 19.5 7C19.5 5.61929 18.3807 4.5 17 4.5C15.6193 4.5 14.5 5.61929 14.5 7C14.5 8.38071 15.6193 9.5 17 9.5ZM17 19.5C18.3807 19.5 19.5 18.3807 19.5 17C19.5 15.6193 18.3807 14.5 17 14.5C15.6193 14.5 14.5 15.6193 14.5 17C14.5 18.3807 15.6193 19.5 17 19.5Z" fill="white"/>
              </svg>
            </button>

            <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`}>
              <Link 
                to="/" 
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Главная
              </Link>
              <Link 
                to="/genres" 
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Жанры
              </Link>
            </nav>

            <div className="header-actions">
              {isMobile ? (
                <button 
                  className="search-btn"
                  onClick={() => setIsMobileSearchOpen(true)}
                  aria-label="Поиск"
                >
                  <svg width="20" height="20" viewBox="46 0 24 24" fill="none">
                    <path d="M62.031 16.6168L66.3137 20.8995L64.8995 22.3137L60.6168 18.031C59.0769 19.263 57.124 20 55 20C50.032 20 46 15.968 46 11C46 6.032 50.032 2 55 2C59.968 2 64 6.032 64 11C64 13.124 63.263 15.0769 62.031 16.6168ZM60.0247 15.8748C61.2475 14.6146 62 12.8956 62 11C62 7.1325 58.8675 4 55 4C51.1325 4 48 7.1325 48 11C48 14.8675 51.1325 18 55 18C56.8956 18 58.6146 17.2475 59.8748 16.0247L60.0247 15.8748Z" fill="white"/>
                  </svg>
                </button>
              ) : (
                <HeaderSearch />
              )}
              
              {isAuthenticated && user ? (
                <button 
                  className="user-btn"
                  onClick={handleAccountClick}
                >
                  {isMobile ? (
                    <svg width="20" height="20" viewBox="88 0 24 24" fill="none">
                      <path d="M92 22C92 17.5817 95.5817 14 100 14C104.418 14 108 17.5817 108 22H106C106 18.6863 103.314 16 100 16C96.6863 16 94 18.6863 94 22H92ZM100 13C96.685 13 94 10.315 94 7C94 3.685 96.685 1 100 1C103.315 1 106 3.685 106 7C106 10.315 103.315 13 100 13ZM100 11C102.21 11 104 9.21 104 7C104 4.79 102.21 3 100 3C97.79 3 96 4.79 96 7C96 9.21 97.79 11 100 11Z" fill="white"/>
                    </svg>
                  ) : (
                    user.surname
                  )}
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

      <MobileSearchModal 
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(closeAuthModal())}
      />
    </>
  );
};

export default Header;
