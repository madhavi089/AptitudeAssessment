import { useState } from "react";
import axios from "axios";

function AddQuestion() {
  const [form, setForm] = useState({
    question_text: "",
    category: "Quantitative",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    difficulty: "Easy",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/questions",
        form
      );

      alert("Question added successfully!");

      setForm({
        question_text: "",
        category: "Quantitative",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        difficulty: "Easy",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add question");
    }
  };

  return (
    <div className="add-question">
      <h1>Add Question</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="question_text"
          placeholder="Enter question"
          value={form.question_text}
          onChange={handleChange}
          required
        />

        <input
          name="option_a"
          placeholder="Option A"
          value={form.option_a}
          onChange={handleChange}
          required
        />

        <input
          name="option_b"
          placeholder="Option B"
          value={form.option_b}
          onChange={handleChange}
          required
        />

        <input
          name="option_c"
          placeholder="Option C"
          value={form.option_c}
          onChange={handleChange}
          required
        />

        <input
          name="option_d"
          placeholder="Option D"
          value={form.option_d}
          onChange={handleChange}
          required
        />

        <label>Correct Answer</label>

        <select
          name="correct_answer"
          value={form.correct_answer}
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
          value={form.category}
          onChange={handleChange}
        >
          <option value="Quantitative">Quantitative</option>
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
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button type="submit">
          Add Question
        </button>
      </form>
    </div>
  );
}

export default AddQuestion;