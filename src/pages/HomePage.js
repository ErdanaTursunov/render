import React, { useEffect } from 'react';
import { fetchQuestions, fetchUserTests } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useTest } from '../store/testContext';
import './HomePage.css';

const HomePage = () => {
  const { selectTest, getQuestions, getTests, tests } = useTest();
  const navigate = useNavigate();

  const handleTestClick = async (test) => {
    if (!test?.id || test.status === 'Passed') {
      console.error("Тест уже пройден или некорректные данные:", test);
      return; // Блокируем клик, если тест уже пройден
    }

    selectTest(test); // Сохраняем выбранный тест в контексте

    try {
      const response = await fetchQuestions(test.id);
      getQuestions(response.questions);
      navigate(`/test/${test.id}`); // Программный переход на страницу теста
    } catch (error) {
      console.error('Ошибка загрузки вопросов:', error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Извлекаем userId из localStorage

    if (!userId) return; // Если нет userId, выходим из функции

    const loadTests = async () => {
      try {
        const response = await fetchUserTests(userId); // Запрос тестов по userId
        getTests(response); // Устанавливаем тесты в состояние
      } catch (error) {
        console.error('Ошибка загрузки тестов:', error);
      }
    };

    loadTests();
  }, []);

  return (
    <div className='test-list-container'>
      <h1>Доступные тесты:</h1>

      {tests && tests.length > 0 ? (
        <ul className='test-list'>
          {tests.map((item) => (
            <li
              key={item.id}
              className={`test-item ${item.status === 'Passed' ? 'disabled' : ''}`} // Добавляем класс для пройденных тестов
              onClick={() => handleTestClick(item)}
            >
              <Link className={`test-link ${item.status === 'Passed' ? 'disabled-link' : ''}`} >
                {item?.title || 'Untitled'}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tests available</p>
      )}
    </div>
  );
};

export default HomePage;
