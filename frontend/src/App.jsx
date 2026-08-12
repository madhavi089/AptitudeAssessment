import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import AddQuestion from "./AddQuestion";
import QuestionManagement from "./QuestionManagement";

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  const [timeLeft, setTimeLeft] = useState(600);
  const [started, setStarted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showQuestionManagement, setShowQuestionManagement] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/questions")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  const filteredQuestions = questions.filter((question) => {
    const categoryMatch =
      selectedCategory === "All" ||
      question.category.trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase();

    const difficultyMatch =
      selectedDifficulty === "All" ||
      question.difficulty.trim().toLowerCase() ===
        selectedDifficulty.trim().toLowerCase();

    return categoryMatch && difficultyMatch;
  });

  useEffect(() => {
    if (!started || score !== null) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, score]);

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    let totalScore = 0;

    filteredQuestions.forEach((question) => {
      if (
        selectedAnswers[question.id] === question.correct_answer
      ) {
        totalScore++;
      }
    });

    setScore(totalScore);
  };

  const startAssessment = () => {
    if (filteredQuestions.length === 0) {
      alert("No questions available for the selected category and difficulty.");
      return;
    }

    setSelectedAnswers({});
    setScore(null);
    setTimeLeft(600);
    setStarted(true);
  };

  const retakeAssessment = () => {
    setSelectedAnswers({});
    setScore(null);
    setTimeLeft(600);
    setStarted(false);
  };

  if (showAddQuestion) {
    return (
      <div className="container">
        <button
          className="admin-button"
          onClick={() => setShowAddQuestion(false)}
        >
          Back to Assessment
        </button>

        <AddQuestion />
      </div>
    );
  }

  if (showQuestionManagement) {
    return (
      <div className="container">
        <button
          className="admin-button"
          onClick={() => setShowQuestionManagement(false)}
        >
          Back to Assessment
        </button>

        <QuestionManagement />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="container">

        <button
          className="admin-button"
          onClick={() => setShowAddQuestion(true)}
        >
          Add Question
        </button>

        <button
          className="admin-button"
          onClick={() => setShowQuestionManagement(true)}
        >
          Manage Questions
        </button>

        <div className="start-screen">

          <h1 className="title">
            Aptitude Assessment
          </h1>

          <p>
            Test your aptitude skills
          </p>

          <h2>Choose Category</h2>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            <option value="All">All Categories</option>
            <option value="Quantitative">
              Quantitative
            </option>
            <option value="Logical Reasoning">
              Logical Reasoning
            </option>
            <option value="Verbal Ability">
              Verbal Ability
            </option>
          </select>

          <h2>Choose Difficulty</h2>

          <select
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(e.target.value)
            }
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <p>
            Number of Questions:{" "}
            {filteredQuestions.length}
          </p>

          <p>
            Time Limit: 10 Minutes
          </p>

          {filteredQuestions.length === 0 ? (
            <p>
              No questions available for the selected
              category and difficulty.
            </p>
          ) : (
            <button
              className="submit-button"
              onClick={startAssessment}
            >
              Start Assessment
            </button>
          )}

        </div>
      </div>
    );
  }

  if (score !== null) {
    const answeredQuestions =
      Object.keys(selectedAnswers).length;

    const wrongAnswers =
      answeredQuestions - score;

    const unansweredQuestions =
      filteredQuestions.length - answeredQuestions;

    const percentage =
      filteredQuestions.length > 0
        ? Math.round(
            (score / filteredQuestions.length) * 100
          )
        : 0;

    return (
      <div className="container">

        <div className="result">

          <h1>
            🎉 Assessment Completed!
          </h1>

          <h2>Your Score</h2>

          <div className="score">
            {score} / {filteredQuestions.length}
          </div>

          <p className="correct">
            Correct Answers: {score}
          </p>

          <p className="wrong">
            Wrong Answers: {wrongAnswers}
          </p>

          <p>
            Unanswered Questions: {unansweredQuestions}
          </p>

          <p>
            Percentage: {percentage}%
          </p>

          <button
            className="submit-button"
            onClick={retakeAssessment}
          >
            Retake Assessment
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="container">

      <h1 className="title">
        Aptitude Assessment
      </h1>

      <h2 className="timer">
        Time Left:{" "}
        {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </h2>

      <h2>
        {selectedCategory} - {selectedDifficulty}
      </h2>

      <h2>
        Answer the following questions
      </h2>

      {filteredQuestions.map((question, index) => (
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
      ))}

      <button
        className="submit-button"
        onClick={handleSubmit}
      >
        Submit Assessment
      </button>

    </div>
  );
}

export default App;