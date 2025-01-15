import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';

const PrivateRoute = ({ element, ...rest }) => {
    const { user } = useAuth();

    // Проверка, есть ли пользователь и является ли он администратором
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />; // Перенаправляем на страницу входа, если нет прав
    }

    return <Route {...rest} element={element} />; // Возвращаем маршрут, если у пользователя есть права
};

export default PrivateRoute;