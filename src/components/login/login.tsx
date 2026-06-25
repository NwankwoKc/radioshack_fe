import { useState } from 'react';
import axios from 'axios';
import styles from './login.module.css';
import { useNavigate } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth', {
        email,
        password
      })
      localStorage.setItem('Udata', JSON.stringify({ username: response.data.data.username, id: response.data.data.id }))
      navigate('/rooms')

      console.log('Login attempted with:', { email, password });
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  return (

    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>

          {/* Left Side - Brand/Illustration */}
          <div className={styles.loginBrandSection}>
            <div className={styles.brandContent}>
              <div className={styles.brandIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.2)" />
                  <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12ZM28 22H26V18H22V22H20L24 28L28 22Z" fill="white" />
                </svg>
              </div>
              <h1 className={styles.brandTitle}>Welcome Back</h1>
              <p className={styles.brandDescription}>
                Join your audio rooms and connect with amazing communities around the world.
              </p>
              <div className={styles.brandFeatures}>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot}></span>
                  <span>Live audio conversations</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot}></span>
                  <span>Real-time messaging</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot}></span>
                  <span>Global communities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={styles.loginFormSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Sign In</h2>
              <p className={styles.formSubtitle}>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {error && (
                <div className={styles.errorMessage}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span className={styles.errorText}>{error}</span>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33334 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33334C2.41668 16.6667 1.66668 15.9167 1.66668 15V5.00001C1.66668 4.08334 2.41668 3.33334 3.33334 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.3333 5L10 10.8333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    className={styles.formInput}
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 6.66667H5C4.07953 6.66667 3.33334 7.41286 3.33334 8.33333V16.6667C3.33334 17.5871 4.07953 18.3333 5 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6667V8.33333C16.6667 7.41286 15.9205 6.66667 15 6.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5.83334 6.66667V5.83333C5.83334 3.99238 6.5625 2.5 7.91667 2.5C9.27084 2.5 10 3.99238 10 5.83333V6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={styles.formInput}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span className={styles.checkboxText}>Remember me</span>
                </label>
                <a href="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerText}>or continue with</span>
              </div>

              <div className={styles.socialButtons}>
                <button type="button" className={`${styles.socialButton} ${styles.googleButton}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M18.1713 8.36788H17.5V8.33329H10V11.6666H14.7095C14.0225 13.607 12.1763 15 10 15C7.23875 15 5 12.7612 5 9.99996C5 7.23871 7.23875 4.99996 10 4.99996C11.2745 4.99996 12.4345 5.48079 13.317 6.26621L15.6745 3.90871C14.1858 2.52246 12.195 1.66663 10 1.66663C5.39792 1.66663 1.66667 5.39788 1.66667 9.99996C1.66667 14.602 5.39792 18.3333 10 18.3333C14.6021 18.3333 18.3333 14.602 18.3333 9.99996C18.3333 9.44121 18.2758 8.89579 18.1713 8.36788Z" fill="#FFC107" />
                    <path d="M2.6275 6.12121L5.36542 8.12913C6.10625 6.29496 7.90042 4.99996 10 4.99996C11.2746 4.99996 12.4346 5.48079 13.3171 6.26621L15.6746 3.90871C14.1858 2.52246 12.195 1.66663 10 1.66663C6.79917 1.66663 3.99333 3.47371 2.6275 6.12121Z" fill="#FF3D00" />
                    <path d="M10 18.3333C12.1413 18.3333 14.0842 17.5125 15.5563 16.1862L13.0163 14.0375C12.1431 14.6653 11.0921 15.0012 10 15C7.83875 15 6.0025 13.6258 5.30375 11.6996L2.5875 13.7929C3.93042 16.5017 6.76708 18.3333 10 18.3333Z" fill="#4CAF50" />
                    <path d="M18.1713 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5903 13.7889 13.3974 13.015 14.0379L13.0163 14.0371L15.5563 16.1859C15.3725 16.353 18.3333 14.1667 18.3333 10C18.3333 9.44129 18.2758 8.89587 18.1713 8.36796Z" fill="#1976D2" />
                  </svg>
                  <span>Google</span>
                </button>
                <button type="button" className={`${styles.socialButton} ${styles.githubButton}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10C0 14.418 2.865 18.166 6.839 19.489C7.339 19.581 7.5 19.278 7.5 19.017C7.5 18.783 7.492 18.091 7.488 17.258C4.713 17.861 4.128 15.96 4.128 15.96C3.674 14.808 3.02 14.507 3.02 14.507C2.135 13.902 3.088 13.915 3.088 13.915C4.064 13.983 4.578 14.917 4.578 14.917C5.461 16.428 6.894 15.992 7.516 15.738C7.607 15.093 7.866 14.651 8.148 14.419C5.935 14.167 3.618 13.308 3.618 9.476C3.618 8.385 4.008 7.496 4.649 6.792C4.546 6.541 4.202 5.524 4.746 4.146C4.746 4.146 5.586 3.877 7.48 5.17C8.282 4.947 9.144 4.835 10 4.831C10.855 4.835 11.717 4.947 12.521 5.17C14.413 3.877 15.252 4.146 15.252 4.146C15.798 5.524 15.454 6.541 15.351 6.792C15.993 7.496 16.38 8.385 16.38 9.476C16.38 13.317 14.06 14.165 11.845 14.413C12.199 14.7 12.513 15.31 12.513 16.23C12.513 17.548 12.502 18.61 12.502 19.017C12.502 19.28 12.661 19.586 13.167 19.487C17.138 18.163 20 14.417 20 10C20 4.477 15.523 0 10 0Z" fill="currentColor" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </form>

            <p className={styles.signupPrompt}>
              Don't have an account?{' '}
              <a href="/signup" className={styles.signupLink}>
                Create one here
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
