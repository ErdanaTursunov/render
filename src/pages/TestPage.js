import React, { useState, useEffect } from "react";
import { useTest } from "../store/testContext";
import { fetchQuestions, fetchAnswer, fetchResult } from "../services/api";
import { useParams } from "react-router-dom";
import Question from "../components/Question";
import Navigation from "../components/Navigation";
import TestResults from "../components/TestResults";
import styles from "./TestPage.module.css";

const TestPage = () => {
  const { tests, getQuestions, selectTest, selectedTest, questions } = useTest();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testFinished, setTestFinished] = useState(false);
  const [finishInformation, setFinishInformation] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = !!userAnswers[currentQuestion.id];
  const testSheduleId = selectedTest.id;

  const { id } = useParams();

  useEffect(() => {
    const test = tests.find((test) => test.id === parseInt(id, 10));
    if (test) {
      selectTest(test);
    }

    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions(id);
        getQuestions(response.questions);
      } catch (error) {
        console.error("Ошибка загрузки вопросов:", error);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerClick = async (questionId, answerId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
    await fetchAnswer(testSheduleId, questionId, answerId);
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
      alert("You have not answered all questions!");
    } else {
      setTestFinished(true);
      const response = await fetchResult(testSheduleId);
      setFinishInformation(response);
      console.log(response);
    }
  };

  if (!questions || questions.length === 0) {
    return <div className={styles.empty}>No questions available</div>;
  }

  return (
    <div className={styles.testContainer}>
      {testFinished ? (
        finishInformation ? (
          <TestResults finishInformation={finishInformation} />
        ) : (
          <p>Loading results...</p>
        )
      ) : (
        <>
          <h1 className={styles.title}>Test Questions</h1>
          <Question
            question={currentQuestion}
            userAnswers={userAnswers}
            handleAnswerClick={handleAnswerClick}
          />
          <Navigation
            currentQuestionIndex={currentQuestionIndex}
            questionsLength={questions.length}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            isCurrentQuestionAnswered={isCurrentQuestionAnswered}
            handleFinishTest={handleFinishTest}
            testSheduleId={testSheduleId}
            userAnswers={userAnswers}
          />
        </>
      )}
    </div>
  );
};

export default TestPage;
