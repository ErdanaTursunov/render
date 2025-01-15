import React, { useEffect, useState } from "react";
import {
  fetchQuestions,
  deleteQuestion,
  deleteAnswer,
  addQuestion,
  addAnswers,
} from "../services/api";
import { useParams } from "react-router-dom";
import ResultsPage from "./ResultsPage";
import * as XLSX from "xlsx"; // Импорт библиотеки для работы с Excel
import "./TestManager.css";

const TestManager = () => {
  const { testId } = useParams();
  const [Questions, setQuestions] = useState([]);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newQuestionText, setNewQuestionText] = useState(""); // Для ввода нового вопроса
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await fetchQuestions(testId);
      setQuestions(response.questions);
    };
    loadQuestions();
  }, [testId]);

  const handleAddAnswerField = (questionId) => {
    setSelectedQuestionId(questionId);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const newQuestion = await addQuestion({ testId, questionText: newQuestionText });
      setQuestions([...Questions, newQuestion]);
      setNewQuestionText("");
    } catch (error) {
      console.error("Error adding question:", error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId)
      );
    } catch (error) {
      console.error("Error deleting question:", error.message);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await deleteAnswer(answerId);
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => ({
          ...q,
          Answers: q.Answers.filter((a) => a.id !== answerId),
        }))
      );
    } catch (error) {
      console.error("Error deleting answer:", error.message);
    }
  };

  const downloadTemplate = () => {
    const data = [
      ["Текст вопроса", "Вариант 1", "Вариант 2", "Вариант 3", "Правильный ответ"],
      ["Пример: Какого цвета небо?", "Синий", "Зеленый", "Красный", "1"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Шаблон");

    XLSX.writeFile(workbook, "Шаблон_вопросов.xlsx");
  };

  const handleAddAnswer = async (e, questionId) => {
    e.preventDefault();
    if (!newAnswerText || questionId === null) {
      alert("Please enter an answer.");
      return;
    }
  
    const answerData = { questionId, answerText: newAnswerText, isCorrect };
    try {
      const newAnswer = await addAnswers(answerData);
  
      // Проверяем, что добавленный ответ корректен
      if (!newAnswer || typeof newAnswer !== "object") {
        throw new Error("Invalid response from server");
      }
  
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === questionId
            ? { ...question, Answers: [...(question.Answers || []), newAnswer] }
            : question
        )
      );
      setNewAnswerText(""); // Очищаем поле ввода
    } catch (error) {
      console.error("Error adding answer:", error.message);
    }
  };
  

  // Импорт данных из Excel
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(sheet);
  
      // Валидация данных
      for (const row of importedData) {
        if (
          !row["Текст вопроса"] ||
          !row["Вариант 1"] ||
          !row["Правильный ответ"]
        ) {
          alert("Некорректный формат файла! Проверьте шаблон.");
          return;
        }
      }
  
      // Добавление вопросов и ответов
      for (const row of importedData) {
        const question = await addQuestion({
          testId,
          questionText: row["Текст вопроса"],
        });
  
        // Проверяем наличие вариантов ответов
        const answerKeys = Object.keys(row).filter((key) =>
          key.startsWith("Вариант")
        );
  
        for (let i = 0; i < answerKeys.length; i++) {
          const key = answerKeys[i];
          const answerText = row[key];
          const correctAnswerIndex = parseInt(row["Правильный ответ"], 10) - 1; // Индекс правильного ответа (0-based)
          const isCorrect = i === correctAnswerIndex;
  
          await addAnswers({
            questionId: question.id,
            answerText,
            isCorrect,
          });
        }
      }
  
      // После импорта обновляем список вопросов
      const updatedQuestions = await fetchQuestions(testId);
      setQuestions(updatedQuestions.questions);
      alert("Данные успешно импортированы!");
    } catch (error) {
      console.error("Ошибка импорта:", error.message);
      alert("Произошла ошибка при обработке файла.");
    }
  };
  

  return (
    <div className="testmanager">
      <h1>Управление вопросами для теста</h1>

      <button onClick={downloadTemplate} className="download-template">
        Скачать шаблон
      </button>

      <input
        type="file"
        accept=".xlsx"
        onChange={handleImport}
        className="import-file"
      />

      <form className="testmanager_form_1" onSubmit={handleAddQuestion}>
        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          placeholder="Введите новый вопрос"
          required
        />
        <button type="submit">Добавить вопрос</button>
      </form>

      {Questions && Questions.length > 0 ? (
        <ul className="test-list">
          {Questions.map((question) => (
            <li key={question.id} className="test-item">
              <div className="test-link">
                <div className="questions">
                  <h3>{question.questionText || "Untitled"}</h3>
                  <img
                    src="/delete2.png"
                    alt="Delete question"
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => handleDeleteQuestion(question.id)}
                  />
                </div>

                {Array.isArray(question.Answers) && question.Answers.length > 0 ? (
                  <ul>
                    {question.Answers.map((answer, index) => (
                      <li className="variant" key={index}>
                        <p>{answer.answerText || "Untitled Answer"}</p>
                        <p>{answer.isCorrect ? "True" : "False"}</p>
                        <img
                          src="/delete.png"
                          alt="Delete answer"
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                          onClick={() => handleDeleteAnswer(answer.id)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No answers available</p>
                )}

              <button onClick={() => handleAddAnswerField(question.id)} className="plus" >
                  +
              </button>


              {selectedQuestionId === question.id && (
                  <form
                    onSubmit={(e) => handleAddAnswer(e, question.id)}
                    className="testmanager_form_2"
                  >
                    <input
                      type="text"
                      value={newAnswerText}
                      onChange={(e) => setNewAnswerText(e.target.value)}
                      placeholder="Введите ответ"
                      required
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={isCorrect}
                        onChange={() => setIsCorrect((prev) => !prev)}
                      />
                      Правильный ответ
                    </label>
                    <button type="submit">Добавить ответ</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available</p>
      )}

      

      <ResultsPage testId={testId} />
    </div>
  );
};

export default TestManager;



