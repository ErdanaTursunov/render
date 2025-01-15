import React from 'react';
import styles from "../pages/TestPage.module.css";

const Question = ({ question, userAnswers, handleAnswerClick }) => {
  return (
    <div className={styles.question}>
      <h2>{question.questionText}</h2>
      <ul className={styles.answers}>
        {question.Answers.map((answer) => (
          <li
            key={answer.id}
            className={`${styles.answer} ${
              userAnswers[question.id] === answer.id ? styles.selected : ""
            }`}
            onClick={() => handleAnswerClick(question.id, answer.id)}
          >
            {answer.answerText}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
