import React, { useState, useEffect } from "react";
import styles from "./TestPage.module.css";
import { useTest } from "../store/testContext";
import { fetchAnswer, fetchQuestions, fetchResult } from "../services/api";
import { useParams } from "react-router-dom";

const TestPage = () => {
  const { tests, getQuestions, selectTest, selectedTest, questions } = useTest();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testFinished, setTestFinished] = useState(false);
  const [finishInformation, setFinishInformation] = useState(null)



  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = !!userAnswers[currentQuestion.id];
  const testSheduleId = selectedTest.Test.id

  const { id } = useParams();

  useEffect(() => {
    // Найти тест по id и установить его в контекст
    const test = tests.find((test) => test.Test.id === parseInt(id, 10));
    if (test) {
      selectTest(test);
    }

    // Загрузить вопросы на основе id теста
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions(id);
        getQuestions(response.questions);
      } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerClick = async (questionId, answerId, testSheduleId ) => {
    
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
    // console.log(selectedTest.Test.id)
    await fetchAnswer(testSheduleId, questionId, answerId)
    
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinishTest = async (testSheduleId) => {
    const unansweredQuestions = questions.filter(
      (question) => !userAnswers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      alert(`You have not answered all questions!`);
    } else {
      setTestFinished(true);
      const response = await fetchResult(testSheduleId)
      setFinishInformation(response)
      console.log('result: ',response);
    }

  };

  if (!questions || questions.length === 0) {
    return <div className={styles.empty}>No questions available</div>;
  }

  return (
    <div className={styles.testContainer}>
      {testFinished ? (
        finishInformation ? (
          <div >
            <h1 className={styles.title}>Test Results</h1>
            <p className={styles.text}>Total Questions: {finishInformation.totalQuestions}</p>
            <p className={styles.text}>Correct Answers: {finishInformation.correctAnswers}</p>
            <p className={styles.text}>Score: {finishInformation.score}</p>
          </div>
        ) : (
          <p>Loading results...</p>
        )
      ) : (
        <>
          <h1 className={styles.title}>Test Questions</h1>
          
          <div className={styles.question}>
            <h2>{currentQuestion.questionText}</h2>
            <ul className={styles.answers}>
              {currentQuestion.Answers.map((answer) => (
                <li
                  key={answer.id}
                  className={`${styles.answer} ${
                    userAnswers[currentQuestion.id] === answer.id ? styles.selected : ""
                  }`}
                  onClick={() => handleAnswerClick(currentQuestion.id, answer.id, testSheduleId)}
                >
                  {answer.answerText}
                </li>
              
              ))}
            </ul>
          </div>
          <div className={styles.navigation}>
            <button
              className={styles.navButton}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <div className={styles.progress}>
              <p>
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered}
              >
                Next
              </button>
            ) : (
              <button
                className={styles.finishButton}
                onClick={() => handleFinishTest(testSheduleId)}
                disabled={Object.keys(userAnswers).length !== questions.length}
              >
                Finish Test
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TestPage;
