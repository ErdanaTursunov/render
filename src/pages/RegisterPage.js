import React, { useState } from 'react';
import { fetchRegister } from '../services/api';
import { useAuth } from '../store/authContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: 'aaa@aa.aa',
    password: 'mypassword',
    role: 'student',
    name: 'myName',
    groupId: 1,
  });
  const [confirmPassword, setConfirmPassword] = useState('mypassword');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const data = await fetchRegister(formData);

      // Сохранение токена и роли в localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      // Авторизация в контексте
      login(data.token, data.user);

      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration error');
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          name="name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          name="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          name="password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Group"
          name="groupId"
          value={formData.groupId}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default RegisterPage;
