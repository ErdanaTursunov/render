import React, { useState } from 'react';
import { fetchLogin } from '../services/api';
import { useAuth } from '../store/authContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('charlie@example.com');
  const [password, setPassword] = useState('mypassword');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await fetchLogin(email, password);

      // Сохранение токена и роли в localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user.id); // Сохраняем userId

      // Авторизация в контексте
      login(data.token, data.user);

      // Перенаправление в зависимости от роли
      if (data.user.role === 'teacher') {
        navigate('/admin/tests');
      } else if (data.user.role === 'student') {
        navigate('/');
      } else if (data.user.role === 'admin') {
        navigate('/admin/tests');
      } else {
        console.warn('Unknown role:', data.user.role);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default LoginPage;
