import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [questions, setQuestions] = useState([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/questions`
      );

      setQuestions(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!started || score !== null) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, score]);

  const shuffleQuestions = (questionList) => {
    return [...questionList].sort(
      () => Math.random() - 0.5
    );
  };

  const startAssessment = () => {
    const quantitativeQuestions = questions.filter(
      (question) =>
        question.category?.trim().toLowerCase() ===
        "quantitative"
    );

    const logicalQuestions = questions.filter(
      (question) =>
        question.category?.trim().toLowerCase() ===
        "logical reasoning"
    );

    const verbalQuestions = questions.filter(
      (question) =>
        question.category?.trim().toLowerCase() ===
        "verbal ability"
    );

    if (quantitativeQuestions.length < 5) {
      alert(
        "At least 5 Quantitative questions are required."
      );
      return;
    }

    if (logicalQuestions.length < 5) {
      alert(
        "At least 5 Logical Reasoning questions are required."
      );
      return;
    }

    if (verbalQuestions.length < 5) {
      alert(
        "At least 5 Verbal Ability questions are required."
      );
      return;
    }

    const selectedQuantitative =
      shuffleQuestions(
        quantitativeQuestions
      ).slice(0, 5);

    const selectedLogical =
      shuffleQuestions(
        logicalQuestions
      ).slice(0, 5);

    const selectedVerbal =
      shuffleQuestions(
        verbalQuestions
      ).slice(0, 5);

    const finalQuestions = shuffleQuestions([
      ...selectedQuantitative,
      ...selectedLogical,
      ...selectedVerbal,
    ]);

    setAssessmentQuestions(finalQuestions);
    setSelectedAnswers({});
    setScore(null);
    setTimeLeft(600);
    setStarted(true);
  };

  const handleAnswerChange = (
    questionId,
    answer
  ) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    let totalScore = 0;

    assessmentQuestions.forEach((question) => {
      if (
        selectedAnswers[question.id] ===
        question.correct_answer
      ) {
        totalScore++;
      }
    });

    setScore(totalScore);
  };

  const getReviewOptionClass = (
    question,
    optionLetter
  ) => {
    const selectedAnswer =
      selectedAnswers[question.id];

    const correctAnswer =
      question.correct_answer;

    if (optionLetter === correctAnswer) {
      return "review-option correct-option";
    }

    if (
      optionLetter === selectedAnswer &&
      selectedAnswer !== correctAnswer
    ) {
      return "review-option wrong-option";
    }

    return "review-option";
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="start-screen">
          <h1 className="title">
            Aptitude Assessment
          </h1>

          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="start-screen">
          <h1 className="title">
            Aptitude Assessment
          </h1>

          <p className="error">
            {error}
          </p>

          <button
            className="submit-button"
            onClick={loadQuestions}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="container">
        <div className="start-screen">
          <h1 className="title">
            Aptitude Assessment
          </h1>

          <p>
            Test your aptitude skills
          </p>

          <h2>
            Assessment Pattern
          </h2>

          <p>
            Quantitative: 5 Questions
          </p>

          <p>
            Logical Reasoning: 5 Questions
          </p>

          <p>
            Verbal Ability: 5 Questions
          </p>

          <h3>
            Total Questions: 15
          </h3>

          <p>
            Time Limit: 10 Minutes
          </p>

          <button
            className="submit-button"
            onClick={startAssessment}
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (score !== null) {
    const answeredQuestions =
      Object.keys(selectedAnswers).length;

    const wrongAnswers =
      assessmentQuestions.filter(
        (question) => {
          const selectedAnswer =
            selectedAnswers[question.id];

          return (
            selectedAnswer &&
            selectedAnswer !==
              question.correct_answer
          );
        }
      ).length;

    const unansweredQuestions =
      assessmentQuestions.length -
      answeredQuestions;

    const percentage =
      assessmentQuestions.length > 0
        ? Math.round(
            (score /
              assessmentQuestions.length) *
              100
          )
        : 0;

    return (
      <div className="container">

        <div className="result">
          <h1>
            Assessment Completed
          </h1>

          <h2>
            Your Score
          </h2>

          <div className="score">
            {score} / {assessmentQuestions.length}
          </div>

          <p className="correct-result">
            Correct Answers: {score}
          </p>

          <p className="wrong-result">
            Wrong Answers: {wrongAnswers}
          </p>

          <p className="unanswered-result">
            Unanswered Questions:{" "}
            {unansweredQuestions}
          </p>

          <p>
            Percentage: {percentage}%
          </p>
        </div>

        <h1 className="title review-title">
          Review Answers
        </h1>

        {assessmentQuestions.map(
          (question, index) => (
            <div
              className="question-card"
              key={question.id}
            >

              <h3>
                Question {index + 1}:{" "}
                {question.question_text}
              </h3>

              <div
                className={getReviewOptionClass(
                  question,
                  "A"
                )}
              >
                <strong>A.</strong>{" "}
                {question.option_a}
              </div>

              <div
                className={getReviewOptionClass(
                  question,
                  "B"
                )}
              >
                <strong>B.</strong>{" "}
                {question.option_b}
              </div>

              <div
                className={getReviewOptionClass(
                  question,
                  "C"
                )}
              >
                <strong>C.</strong>{" "}
                {question.option_c}
              </div>

              <div
                className={getReviewOptionClass(
                  question,
                  "D"
                )}
              >
                <strong>D.</strong>{" "}
                {question.option_d}
              </div>

            </div>
          )
        )}

      </div>
    );
  }

  return (
    <div className="container">

      <h1 className="title">
        Aptitude Assessment
      </h1>

      <h2 className="timer">
        Time Left: {formatTime()}
      </h2>

      <h2 className="title">
        Answer the following 15 questions
      </h2>

      {assessmentQuestions.map(
        (question, index) => (
          <div
            className="question-card"
            key={question.id}
          >

            <h3>
              Question {index + 1}:{" "}
              {question.question_text}
            </h3>

            <label className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={
                  selectedAnswers[
                    question.id
                  ] === "A"
                }
                onChange={() =>
                  handleAnswerChange(
                    question.id,
                    "A"
                  )
                }
              />

              A. {question.option_a}
            </label>

            <label className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={
                  selectedAnswers[
                    question.id
                  ] === "B"
                }
                onChange={() =>
                  handleAnswerChange(
                    question.id,
                    "B"
                  )
                }
              />

              B. {question.option_b}
            </label>

            <label className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={
                  selectedAnswers[
                    question.id
                  ] === "C"
                }
                onChange={() =>
                  handleAnswerChange(
                    question.id,
                    "C"
                  )
                }
              />

              C. {question.option_c}
            </label>

            <label className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={
                  selectedAnswers[
                    question.id
                  ] === "D"
                }
                onChange={() =>
                  handleAnswerChange(
                    question.id,
                    "D"
                  )
                }
              />

              D. {question.option_d}
            </label>

          </div>
        )
      )}

      <button
        className="submit-button"
        onClick={handleSubmit}
      >
        Submit Test
      </button>

    </div>
  );
}

export default App;