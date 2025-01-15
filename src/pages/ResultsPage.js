import React, { useEffect, useState } from "react";
import { fetchResults, fetchUser } from "../services/api";
import * as XLSX from "xlsx"; // Импорт библиотеки для работы с Excel

const ResultsPage = ({ testId }) => {
  const [results, setResults] = useState([]);
  const [userData, setUserData] = useState({}); // Для хранения информации о пользователе

  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await fetchResults(testId);
        setResults(response); // Устанавливаем данные в состояние
      } catch (error) {
        console.error("Error loading results:", error.message);
      }
    };
    loadResults();
  }, [testId]);

  useEffect(() => {
    const loadUserData = async () => {
      const usersData = {};
      for (const result of results) {
        try {
          const userResponse = await fetchUser(result.userId);
          usersData[result.userId] = userResponse.name; // Сохраняем имя пользователя
        } catch (error) {
          console.error("Error loading user:", error.message);
        }
      }
      setUserData(usersData);
    };

    if (results.length > 0) {
      loadUserData(); // Загружаем данные о пользователях после получения результатов
    }
  }, [results]);

  // Функция для экспорта результатов в Excel
  const exportToExcel = () => {
    // Преобразуем данные для экспорта
    const dataForExcel = results.map((result) => ({
      Пользователь: userData[result.userId] || "Загрузка...",
      "Правильные ответы": result.correctAnswers,
      "Общее количество вопросов": result.totalQuestions,
      "Процент правильных ответов": `${result.resultPercentage}%`,
    }));

    // Создаем рабочую книгу и добавляем данные
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Результаты");

    // Генерация файла Excel и его скачивание
    XLSX.writeFile(workbook, `Результаты_тестов_${testId}.xlsx`);
  };

  return (
    <div className="resultpage">
      <h1>Результаты тестов</h1>

      {/* Кнопка для экспорта в Excel */}
      <button onClick={exportToExcel} className="export-button">
        Экспортировать в Excel
      </button>

      {/* Таблица результатов */}
      {results.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Правильные ответы</th>
              <th>Общее количество вопросов</th>
              <th>Процент правильных ответов</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{userData[result.userId] || "Загрузка..."}</td>
                <td>{result.correctAnswers}</td>
                <td>{result.totalQuestions}</td>
                <td>{result.resultPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Нет результатов для отображения</p>
      )}
    </div>
  );
};

export default ResultsPage;
