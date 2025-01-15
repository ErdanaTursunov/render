import React from 'react';
import styles from "../pages/TestPage.module.css";

const Navigation = ({
  currentQuestionIndex,
  questionsLength,
  handleNext,
  handlePrevious,
  isCurrentQuestionAnswered,
  handleFinishTest,
  testSheduleId,
  userAnswers
}) => {
  return (
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
          Question {currentQuestionIndex + 1} of {questionsLength}
        </p>
      </div>
      {currentQuestionIndex < questionsLength - 1 ? (
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
          disabled={Object.keys(userAnswers).length !== questionsLength}
        >
          Finish Test
        </button>
      )}
    </div>
  );
};

export default Navigation;
