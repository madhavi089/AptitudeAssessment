import { useEffect, useState } from "react";
import axios from "axios";

function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const loadQuestions = () => {
    axios
      .get("http://127.0.0.1:8000/questions")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleDelete = async (questionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/questions/${questionId}`
      );

      alert("Question deleted successfully!");

      loadQuestions();
    } catch (error) {
      console.error(error);
      alert("Failed to delete question");
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion({ ...question });
  };

  const handleChange = (e) => {
    setEditingQuestion({
      ...editingQuestion,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://127.0.0.1:8000/questions/${editingQuestion.id}`,
        {
          question_text: editingQuestion.question_text,
          category: editingQuestion.category,
          option_a: editingQuestion.option_a,
          option_b: editingQuestion.option_b,
          option_c: editingQuestion.option_c,
          option_d: editingQuestion.option_d,
          correct_answer: editingQuestion.correct_answer,
          difficulty: editingQuestion.difficulty,
        }
      );

      alert("Question updated successfully!");

      setEditingQuestion(null);

      loadQuestions();
    } catch (error) {
      console.error(error);
      alert("Failed to update question");
    }
  };

  if (editingQuestion) {
    return (
      <div className="container">
        <div className="start-screen">

          <h1>Edit Question</h1>

          <form onSubmit={handleUpdate}>

            <input
              name="question_text"
              placeholder="Enter question"
              value={editingQuestion.question_text}
              onChange={handleChange}
              required
            />

            <input
              name="option_a"
              placeholder="Option A"
              value={editingQuestion.option_a}
              onChange={handleChange}
              required
            />

            <input
              name="option_b"
              placeholder="Option B"
              value={editingQuestion.option_b}
              onChange={handleChange}
              required
            />

            <input
              name="option_c"
              placeholder="Option C"
              value={editingQuestion.option_c}
              onChange={handleChange}
              required
            />

            <input
              name="option_d"
              placeholder="Option D"
              value={editingQuestion.option_d}
              onChange={handleChange}
              required
            />

            <label>Correct Answer</label>

            <select
              name="correct_answer"
              value={editingQuestion.correct_answer}
              onChange={handleChange}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <label>Category</label>

            <select
              name="category"
              value={editingQuestion.category}
              onChange={handleChange}
            >
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

            <label>Difficulty</label>

            <select
              name="difficulty"
              value={editingQuestion.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <button
              type="submit"
              className="submit-button"
            >
              Update Question
            </button>

            <button
              type="button"
              className="admin-button"
              onClick={() => setEditingQuestion(null)}
            >
              Cancel
            </button>

          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">

      <h1 className="title">
        Question Management
      </h1>

      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        questions.map((question, index) => (
          <div
            className="question-card"
            key={question.id}
          >

            <h3>
              {index + 1}. {question.question_text}
            </h3>

            <p>
              <strong>Category:</strong>{" "}
              {question.category}
            </p>

            <p>
              <strong>Difficulty:</strong>{" "}
              {question.difficulty}
            </p>

            <button
              className="edit-button"
              onClick={() =>
                handleEdit(question)
              }
            >
              Edit
            </button>

            <button
              className="delete-button"
              onClick={() =>
                handleDelete(question.id)
              }
            >
              Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default QuestionManagement;