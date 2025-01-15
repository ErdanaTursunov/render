import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../store/authContext';

const Header = () => {
  const { logout, user } = useAuth(); // Убрали isAuthenticated
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isUser = user?.role === 'student';

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          Test Application
        </Link>
        <nav className="header_nav">
          <ul className="nav-links">
            {user ? (
              <>
                {/* Общие ссылки */}
                <li>
                  <Link to="/profile">{user?.name || 'profile'}</Link>
                </li>

                {/* Доступ для admin и teacher */}
                {(isAdmin || isTeacher) && (
                  <>
                    <li>
                      <Link to="/admin/shedules">Назначить время</Link>
                    </li>
                    <li>
                      <Link to="/admin/groups">Группы</Link>
                    </li>
                    <li>
                      <Link to="/admin/tests">Создать</Link>
                    </li>
                    <li>
                      <Link to="/admin/students">Студенты</Link>
                    </li>
                  </>
                )}

                {/* Доступ только для admin */}
                {isAdmin && (
                  <li>
                    <Link to="/">Главная</Link>
                  </li>
                )}

                {/* Доступ только для user */}
                {isUser && (
                  <li>
                    <Link to="/">Мои тесты</Link>
                  </li>
                )}

                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
