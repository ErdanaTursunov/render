import React, { createContext, useContext, useState } from 'react';

// Создаём контекст
const TestContext = createContext();

// Создаём провайдер для контекста
export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState(null);  
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState(null);


  const selectTest = (test) => {
    setSelectedTest(test);
  };

  const getQuestions = (questions) => {
    setQuestions(questions);
  };

  const getTests = (tests) => {
    setTests(tests);
  };

  return (
    <TestContext.Provider value={{ selectedTest, selectTest, getQuestions, questions, tests, getTests }}>
      {children}
    </TestContext.Provider>
  );
};

// Хук для использования контекста
export const useTest = () => {
  return useContext(TestContext);
};
