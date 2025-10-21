import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, registerUser, clearRegistrationSuccess } from '../../store/slices/authSlice';
import { closeAuthModal } from '../../store/slices/modalSlice';
import { LoginCredentials, RegisterCredentials } from '../../types';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
  surname: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  general?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isRegistrationSuccess } = useAppSelector((state) => state.auth);
  
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    surname: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Имя обязательно';
      }
      
      if (!formData.surname.trim()) {
        newErrors.surname = 'Фамилия обязательна';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    console.log('Отправка формы:', { isLogin, formData });
    
    if (!validateForm()) {
      console.log('Валидация не прошла:', errors);
      return;
    }
    
    try {
      if (isLogin) {
        console.log('Попытка входа...');
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password
        };
        await dispatch(loginUser(credentials)).unwrap();
        console.log('Вход успешен');
      } else {
        console.log('Попытка регистрации...');
        const credentials: RegisterCredentials = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname
        };
        await dispatch(registerUser(credentials)).unwrap();
        console.log('Регистрация успешна');
      }
      onClose();
      setFormData({ email: '', password: '', name: '', surname: '' });
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      // Error is handled by Redux
    }
  };

  const toggleMode = (): void => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: '', password: '', name: '', surname: '' });
  };

  const handleGoToLogin = (): void => {
    dispatch(clearRegistrationSuccess());
    setIsLogin(true);
    setErrors({});
    setFormData({ email: '', password: '', name: '', surname: '' });
  };

  if (!isOpen) return null;

  // Показываем окно успешной регистрации
  if (isRegistrationSuccess) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="auth-modal auth-modal--success" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          
          <div className="auth-modal__header">
            <div className="auth-modal__logo">
              <div className="logo-circle">
                <span className="logo-text">маруся</span>
              </div>
            </div>
            <h2 className="auth-modal__title">Регистрация завершена</h2>
            <p className="auth-modal__subtitle">Используйте вашу электронную почту для входа</p>
          </div>
          
          <div className="auth-modal__actions">
            <button 
              className="auth-modal__submit auth-modal__submit--success"
              onClick={handleGoToLogin}
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="auth-modal__header">
          <div className="auth-modal__logo">
            <div className="logo-circle">
              <span className="logo-text">маруся</span>
            </div>
          </div>
          <h2 className="auth-modal__title">
            {isLogin ? 'Вход' : 'Регистрация'}
          </h2>
        </div>
        
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message error-message--general">
              {errors.general}
            </div>
          )}
          
          {error && (
            <div className="error-message error-message--general">
              {error}
            </div>
          )}
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                  placeholder="Введите имя"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="surname" className="form-label">Фамилия</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className={`form-input ${errors.surname ? 'form-input--error' : ''}`}
                  placeholder="Введите фамилию"
                />
                {errors.surname && <span className="error-message">{errors.surname}</span>}
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="Введите email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              placeholder="Введите пароль"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            className="auth-modal__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        
        <div className="auth-modal__footer">
          <button 
            type="button" 
            className="auth-modal__toggle"
            onClick={toggleMode}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'У меня есть пароль'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
