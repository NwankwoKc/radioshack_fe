import React, { useState } from 'react';
import './signup.module.css';
import { useNavigate } from 'react-router';
import axios from 'axios';
import styles from './signup.module.css';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}



interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

interface TouchedFields {
  username: boolean;
  email: boolean;
  password: boolean;
}

const Signup = () => {
  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({
    username: false,
    email: false,
    password: false,
  });
  const [submitError, setSubmitError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const navigate = useNavigate()
  const validateField = (name: keyof SignupFormData, value: string): string => {
    switch (name) {
      case 'username':
        if (!value.trim()) {
          return 'Username is required';
        }
        if (value.length < 3) {
          return 'Username must be at least 3 characters';
        }
        if (value.length > 20) {
          return 'Username must be less than 20 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        return '';

      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'password':
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        if (!/(?=.*\d)/.test(value)) {
          return 'Password must contain at least one number';
        }
        return '';
      default:
        return '';
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear submit error when user types
    if (submitError) {
      setSubmitError('');
    }

    // Validate if field has been touched
    if (touched[name as keyof TouchedFields]) {
      const error = validateField(name as keyof SignupFormData, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // Handle field blur (mark as touched)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name as keyof SignupFormData, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof SignupFormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error !== '') {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    console.log('clicked', formData)
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      setSubmitError('Please fix the errors before submitting');
      return;
    }
    console.log('is validated')

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/users', formData)
      localStorage.setItem('Udata', JSON.stringify({ username: response.data.data.username, id: response.data.data.id }))
      navigate('/rooms')

    } catch (err) {
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthInfo = (): { label: string; color: string; width: string } => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { label: 'Weak', color: '#ef4444', width: '20%' };
      case 2:
        return { label: 'Fair', color: '#f59e0b', width: '40%' };
      case 3:
        return { label: 'Good', color: '#10b981', width: '60%' };
      case 4:
        return { label: 'Strong', color: '#059669', width: '80%' };
      case 5:
        return { label: 'Very Strong', color: '#047857', width: '100%' };
      default:
        return { label: '', color: '#e5e7eb', width: '0%' };
    }
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupWrapper}>
        <div className={styles.signupCard}>

          {/* Left Side - Brand/Illustration */}
          <div className={styles.signupBrandSection}>
            <div className={styles.brandContent}>
              <div className={styles.brandIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.2)" />
                  <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12ZM28 22H26V18H22V22H20L24 28L28 22Z" fill="white" />
                </svg>
              </div>
              <h1 className={styles.brandTitle}>Join Our Community</h1>
              <p className={styles.brandDescription}>
                Create your account and start connecting with people through live audio conversations and real-time messaging.
              </p>
              <div className={styles.brandFeatures}>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot}></span>
                  <span>Create and join audio rooms</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot}></span>
                  <span>Connect with communities worldwide</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot}></span>
                  <span>Real-time chat and messaging</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot}></span>
                  <span>Host live discussions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className={styles.signupFormSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSubtitle}>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.signupForm} noValidate>
              {/* Submit Error Message */}
              {submitError && (
                <div className={styles.errorMessage}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span className={styles.errorText}>{submitError}</span>
                </div>
              )}

              {/* Username Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.inputLabel}>
                  Username
                </label>
                <div className={`${styles.inputWrapper} ${errors.username && touched.username ? styles.inputError : ''}`}>
                  <span className={styles.inputIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="currentColor" />
                      <path d="M10 12C5.58172 12 2 14.6863 2 18V20H18V18C18 14.6863 14.4183 12 10 12Z" fill="currentColor" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={styles.formInput}
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="username"
                    data-testid="username-input"
                  />
                  {formData.username && !errors.username && (
                    <span data-testid="usernamesucc" className={styles.fieldSuccess}>✓</span>
                  )}
                </div>
                {errors.username && touched.username && (
                  <span data-testid="username" className={styles.fieldError}>{errors.username}</span>
                )}
              </div>

              {/* Email Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Email Address
                </label>
                <div className={`${styles.inputWrapper} ${errors.email && touched.email ? styles.inputError : ''}`}>
                  <span className={styles.inputIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33334 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33334C2.41668 16.6667 1.66668 15.9167 1.66668 15V5.00001C1.66668 4.08334 2.41668 3.33334 3.33334 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.3333 5L10 10.8333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.formInput}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {formData.email && !errors.email && (
                    <span data-testid="emailsucc" className={styles.fieldSuccess}>✓</span>
                  )}
                </div>
                {errors.email && touched.email && (
                  <span data-testid="email" className={styles.fieldError}>{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
                  Password
                </label>
                <div className={`${styles.inputWrapper} ${errors.password && touched.password ? styles.inputError : ''}`}>
                  <span className={styles.inputIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 6.66667H5C4.07953 6.66667 3.33334 7.41286 3.33334 8.33333V16.6667C3.33334 17.5871 4.07953 18.3333 5 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6667V8.33333C16.6667 7.41286 15.9205 6.66667 15 6.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5.83334 6.66667V5.83333C5.83334 3.99238 6.5625 2.5 7.91667 2.5C9.27084 2.5 10 3.99238 10 5.83333V6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={styles.formInput}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <span data-testid="passwrd" className={styles.fieldError}>{errors.password}</span>
                )}

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div
                        className={styles.strengthFill}
                        style={{
                          width: strengthInfo.width,
                          backgroundColor: strengthInfo.color,
                        }}
                      ></div>
                    </div>
                    <span
                      className={styles.strengthLabel}
                      style={{ color: strengthInfo.color }}
                    >
                      {strengthInfo.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                data-testid="createaccount"
                type="submit"
                className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className={styles.divider}>
                <span className={styles.dividerText}>or sign up with</span>
              </div>

              {/* Social Buttons */}
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

            {/* Login Prompt */}
            <p className={styles.loginPrompt}>
              Already have an account?{' '}
              <a href="/login" className={styles.loginLink}>
                Sign in here
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
