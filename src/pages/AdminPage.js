import React, { useState, useEffect } from "react";
import { createTest, deleteTest, fetchTests, fetchQuestions } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useTest } from "../store/testContext";
import './adminPage.css'

const AdminPage = () => {
  const { selectTest, getQuestions, getTests, tests } = useTest();
  const navigate = useNavigate();

  // Состояние для формы создания теста
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleTestClick = async (item) => {
    if (!item?.id) {
      console.error("Некорректные данные теста:", item);
      return;
    }

    selectTest(item); // Сохраняем выбранный тест в контексте

    try {
      const response = await fetchQuestions(item.id);
      getQuestions(response.questions);
      navigate(`/admin/test/${item.id}`); // Программный переход на страницу теста
    } catch (error) {
      console.error("Ошибка загрузки вопросов:", error);
    }
  };

  // Удаление теста
  const handleDeleteTests = async (testId) => {
    try {
      await deleteTest(testId);

      // Обновляем состояние тестов после удаления
      getTests(tests.filter((test) => test.id !== testId));
    } catch (error) {
      console.error("Ошибка при удалении теста:", error.message);
    }
  };

  // Создание нового теста
  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Both title and description are required!");
      return;
    }

    const testData = { title, description };

    try {
      await createTest(testData);
      setTitle("");
      setDescription("");
      setError(""); // Сброс ошибок

      // Обновляем список тестов после создания
      const response = await fetchTests();
      getTests(response);
    } catch (error) {
      console.error("Ошибка при создании теста:", error.message);
      setError("Failed to create test.");
    }
  };

  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await fetchTests(); // Замените на ваш endpoint
        getTests(response); // Устанавливаем тесты в состояние через контекст
      } catch (error) {
        console.error("Ошибка загрузки тестов:", error);
      }
    };

    loadTests();
  }, []);

  return (
    <div className="adminpage">
      <h1>Создать тест:</h1>

      {/* Форма создания теста */}
      <form className="blocks" onSubmit={handleCreateTest}>
        <div >
          <label htmlFor="title">Название теста:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Описание теста:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Создать тест</button>
      </form>
      <h1>Доступные тесты:</h1>

      {tests && tests.length > 0 ? (
        <ul className="test-list">
          {tests.map((item) => (
            <li
              key={item.id}
              className="test-item"
              onClick={() => handleTestClick(item)}
            >
              <span className="test-link">{item?.title || "Untitled"}</span>
              <img
                src="/delete.png"
                alt="Delete test"
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={(e) => {
                  e.stopPropagation(); // Останавливаем событие клика на тест
                  handleDeleteTests(item.id);
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No tests available</p>
      )}
    </div>
  );
};

export default AdminPage;
