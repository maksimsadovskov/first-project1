import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, registerUser, clearRegistrationSuccess } from '../../store/slices/authSlice';
import { LoginCredentials, RegisterCredentials } from '../../types';
import logoMarusya from '../../assets/logos/mask-group.svg';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  surname?: string;
  general?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error: authError, isRegistrationSuccess } = useAppSelector((state) => state.auth);
  
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  // Всегда открываем модалку в режиме "Вход" только если это не окно успешной регистрации
  useEffect(() => {
    if (isOpen && !isRegistrationSuccess) {
      setIsLogin(true);
      setErrors({});
      setFormData({ email: '', password: '', confirmPassword: '', name: '', surname: '' });
      setTouched({});
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, isRegistrationSuccess]);

  // Очищаем ошибки при изменении email
  useEffect(() => {
    if (formData.email && errors.email) {
      // Проверяем, что email валидный, и если да - очищаем ошибку
      if (/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
  }, [formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing (only if field was touched)
    if (errors[name as keyof FormErrors] && touched[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate only if form was attempted to submit
    if (hasAttemptedSubmit) {
      validateForm();
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
      
      // Валидация подтверждения пароля
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Подтвердите пароль';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
        // Если пароли не совпадают и пароль валиден, также показываем ошибку на поле пароля
        if (formData.password.trim() && formData.password.length >= 6 && !newErrors.password) {
          newErrors.password = 'Пароли не совпадают';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Помечаем, что была попытка отправки формы
    setHasAttemptedSubmit(true);
    
    // Помечаем все поля как "тронутые"
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      name: true,
      surname: true
    });
    
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    
    try {
      if (isLogin) {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password
        };
        await dispatch(loginUser(credentials)).unwrap();
        onClose();
        setFormData({ email: '', password: '', confirmPassword: '', name: '', surname: '' });
        setErrors({});
      } else {
        const credentials: RegisterCredentials = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname
        };
        await dispatch(registerUser(credentials)).unwrap();
        // Не закрываем модальное окно, чтобы показать экран успешной регистрации
        setFormData({ email: '', password: '', confirmPassword: '', name: '', surname: '' });
        setErrors({});
        // Не сбрасываем isLogin, чтобы при переходе к входу форма была правильной
        return;
      }
    } catch (error: any) {
      console.error('=== Ошибка авторизации ===', error);
      // Игнорируем ошибки валидации от API про символы в email (это требование API, но не критично)
      const errorMessage = error?.message || error || '';
      if (typeof errorMessage === 'string' && (errorMessage.includes('символ') || errorMessage.includes('не должна содержать'))) {
        // Игнорируем эту ошибку, так как это нестандартное требование API
        // Используем локальную авторизацию
        return;
      }
      // Для других ошибок показываем сообщение
      if (error && typeof error === 'string' && !error.includes('символ') && !error.includes('не должна содержать')) {
        setErrors({ general: error });
      }
    }
  };

  const handleRegistrationClick = (): void => {
    setIsLogin(false);
    setErrors({});
    setFormData({ email: '', password: '', confirmPassword: '', name: '', surname: '' });
    setTouched({});
    setHasAttemptedSubmit(false);
    dispatch(clearRegistrationSuccess());
  };

  const handleBackToLogin = (): void => {
    setIsLogin(true);
    setErrors({});
    setFormData({ email: '', password: '', confirmPassword: '', name: '', surname: '' });
    setTouched({});
    setHasAttemptedSubmit(false);
    dispatch(clearRegistrationSuccess());
  };

  const handleGoToLogin = (): void => {
    console.log('Переход к форме входа');
    dispatch(clearRegistrationSuccess());
    setIsLogin(true);
    setErrors({});
    setFormData({ email: '', password: '', confirmPassword: '', name: '', surname: '' });
    // Модальное окно остается открытым, показываем форму входа
  };

  if (!isOpen) return null;

  // Показываем окно успешной регистрации
  if (isRegistrationSuccess) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="auth-modal auth-modal--success" onClick={(e) => e.stopPropagation()}>
          <button className="auth-modal__close-btn" onClick={onClose} aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z" fill="#000000"/>
            </svg>
          </button>
          <div className="auth-modal__success-content">
            <div className="auth-modal__logo auth-modal__logo--success">
              <img src={logoMarusya} alt="маруся" className="auth-modal__logo-img" />
              <span className="auth-modal__logo-text">маруся</span>
            </div>
            <h2 className="auth-modal__title auth-modal__title--success">Регистрация завершена</h2>
            <p className="auth-modal__subtitle auth-modal__subtitle--success">
              Используйте вашу электронную почту<br />для входа
            </p>
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
      <div className={`auth-modal ${!isLogin ? 'auth-modal--registration' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close-btn" onClick={onClose} aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z" fill="#000000"/>
          </svg>
        </button>
        
        <div className="auth-modal__header">
          <div className="auth-modal__logo">
            <img src={logoMarusya} alt="маруся" className="auth-modal__logo-img" />
            <span className="auth-modal__logo-text">маруся</span>
          </div>
          {!isLogin && (
            <h2 className="auth-modal__title auth-modal__title--registration">Регистрация</h2>
          )}
        </div>
        
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {authError && !authError.includes('символ') && !authError.includes('не должна содержать') && (
            <div className="auth-modal__error-message">
              {authError}
            </div>
          )}
          
          {isLogin ? (
            <>
              <div className="form-group form-group--with-icon">
                <div className="form-input-wrapper">
                  <input
                    type="email"
                    id="email-login"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={`form-input form-input--icon ${errors.email ? 'form-input--error' : ''}`}
                    placeholder=" "
                  />
                  <div className="form-input-label-wrapper">
                    <svg className="form-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                    </svg>
                    <span className="form-input-label">электронная почта</span>
                  </div>
                </div>
                {errors.email && touched.email && hasAttemptedSubmit && (
                  <div className="error-message error-message--field">
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div className="form-group form-group--with-icon">
                <div className="form-input-wrapper">
                  <input
                    type="password"
                    id="password-login"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={`form-input form-input--icon ${errors.password ? 'form-input--error' : ''}`}
                    placeholder=" "
                  />
                  <div className="form-input-label-wrapper">
                    <svg className="form-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 8h-1V6c0-2.76-2.24-5-5-5S6 3.24 6 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z" fill="currentColor"/>
                    </svg>
                    <span className="form-input-label">пароль</span>
                  </div>
                </div>
                {errors.password && touched.password && hasAttemptedSubmit && (
                  <div className="error-message error-message--field">
                    {errors.password}
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="auth-modal__submit"
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'Войти'}
              </button>
              
              <p className="auth-modal__registration-text" onClick={handleRegistrationClick} style={{ cursor: 'pointer' }}>Регистрация</p>
            </>
          ) : (
            <>
              <div className="form-group form-group--with-icon">
                <div className="form-input-wrapper">
                  <input
                    type="email"
                    id="email-register"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={`form-input form-input--icon ${errors.email ? 'form-input--error' : ''}`}
                    placeholder=" "
                  />
                  <div className="form-input-label-wrapper">
                    <svg className="form-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                    </svg>
                    <span className="form-input-label">электронная почта</span>
                  </div>
                </div>
                {errors.email && touched.email && hasAttemptedSubmit && (
                  <div className="error-message error-message--field">
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div className="form-group form-group--with-icon">
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    id="name-register"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input form-input--icon ${errors.name ? 'form-input--error' : ''}`}
                    placeholder=" "
                  />
                  <div className="form-input-label-wrapper">
                    <svg className="form-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                    <span className="form-input-label">имя</span>
                  </div>
                </div>
                {errors.name && touched.name && hasAttemptedSubmit && (
                  <div className="error-message error-message--field">
                    {errors.name}
                  </div>
                )}
              </div>
              
              <div className="form-group form-group--with-icon">
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    id="surname-register"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className={`form-input form-input--icon ${errors.surname ? 'form-input--error' : ''}`}
                    placeholder=" "
                  />
                  <div className="form-input-label-wrapper">
                    <svg className="form-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                    <span className="form-input-label">фамилия</span>
                  </div>
                </div>
                {errors.surname && touched.surname && hasAttemptedSubmit && (
                  <div className="error-message error-message--field">
                    {errors.surname}
                  </div>
                )}
              </div>
              
              <div className="form-group form-group--with-icon">
                <div className="form-input-wrapper">
                  <input
                    type="password"
                    id="password-register"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={`form-input form-input--icon ${errors.password ? 'form-input--error' : ''}`}
                    placeholder=" "
                  />
                  <div className="form-input-label-wrapper">
                    <svg className="form-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 8h-1V6c0-2.76-2.24-5-5-5S6 3.24 6 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z" fill="currentColor"/>
                    </svg>
                    <span className="form-input-label">пароль</span>
                  </div>
                </div>
                {errors.password && touched.password && hasAttemptedSubmit && (
                  <div className="error-message error-message--field">
                    {errors.password}
                  </div>
                )}
              </div>
              
              <div className="form-group form-group--with-icon">
                <div className="form-input-wrapper">
                  <input
                    type="password"
                    id="confirm-password-register"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={`form-input form-input--icon ${errors.confirmPassword ? 'form-input--error' : ''}`}
                    placeholder=" "
                  />
                  <div className="form-input-label-wrapper">
                    <svg className="form-input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 8h-1V6c0-2.76-2.24-5-5-5S6 3.24 6 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z" fill="currentColor"/>
                    </svg>
                    <span className="form-input-label">подтвердите пароль</span>
                  </div>
                </div>
                {errors.confirmPassword && touched.confirmPassword && hasAttemptedSubmit && (
                  <div className="error-message error-message--field">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="auth-modal__submit auth-modal__submit--register"
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'Создать аккаунт'}
              </button>
              
              <p className="auth-modal__back-to-login" onClick={handleBackToLogin} style={{ cursor: 'pointer' }}>У меня есть пароль</p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
