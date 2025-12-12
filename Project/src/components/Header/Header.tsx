import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openAuthModal, closeAuthModal } from '../../store/slices/modalSlice';
import HeaderSearch from '../HeaderSearch/HeaderSearch';
import MobileSearchModal from '../MobileSearchModal/MobileSearchModal';
import AuthModal from '../AuthModal/AuthModal';
import './Header.css';
import { useTheme } from '../../contexts/ThemeContext';
import iconBurger from '../../assets/icons/icon-burger.svg';
import iconSearch from '../../assets/icons/icon-search.svg';
import iconPersonaOutline from '../../assets/icons/icon-persona.svg';
import iconPersonaSolid from '../../assets/icons/user-white.svg';
import iconPersonaFilled from '../../assets/icons/user-white.svg';
import iconEnvelope from '../../assets/icons/icon-envelop.svg';
import iconHeart from '../../assets/icons/icon-heart.svg';
import logoMarusya from '../../assets/logos/маруся.png';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isAuthModalOpen } = useAppSelector((state) => state.modal);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { theme, toggleTheme } = useTheme();

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

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault();
    toggleTheme();
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
        <Link to="/" className={`logo ${theme === 'light' ? 'logo--light' : 'logo--dark'}`} onClick={handleLogoClick}>
          <div className="logo-icon"></div>
          <span>маруся</span>
        </Link>
            {(!isMobile || isMobileMenuOpen) && (
              <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`}>
                <Link 
                  to="/" 
                  className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Главная
                </Link>
                <Link 
                  to="/genres" 
                  className={`nav-link ${location.pathname.startsWith('/genres') ? 'nav-link--active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Жанры
                </Link>
              </nav>
            )}

            <div className="header-actions">
              {isMobile && (
                <button 
                  className="mobile-menu-toggle"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                >
                  <img src={iconBurger} alt="Меню" width={20} height={20} />
                </button>
              )}
              {isMobile ? (
                <button 
                  className="search-btn"
                  onClick={() => setIsMobileSearchOpen(true)}
                  aria-label="Поиск"
                >
                  <img src={iconSearch} alt="Поиск" width={20} height={20} />
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
                    <img src={iconPersonaOutline} alt="Профиль" width={20} height={20} />
                  ) : (
                    user.name
                  )}
                </button>
              ) : (
                <button 
                  className="login-btn"
                  onClick={handleLoginClick}
                >
                  <span className="login-text">Войти</span>
                  <img className="login-icon" src={iconPersonaOutline} alt="Войти" width={20} height={20} />
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
