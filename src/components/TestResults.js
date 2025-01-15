import React from 'react';
import styles from "../pages/TestPage.module.css";

const TestResults = ({ finishInformation }) => {
  console.log(finishInformation);
  
  return (
    <div>
      <h1 className={styles.title}>Test Results</h1>
      <p className={styles.text}>Total Questions: {finishInformation.totalQuestions}</p>
      <p className={styles.text}>Correct Answers: {finishInformation.correctAnswers}</p>
      <p className={styles.text}>Score: {finishInformation.resultPercentage}</p>
    </div>
  );
};

export default TestResults;
