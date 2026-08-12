from pydantic import BaseModel


class QuestionCreate(BaseModel):
    question_text: str
    category: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    difficulty: str


class QuestionResponse(BaseModel):
    id: int
    question_text: str
    category: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    difficulty: str

    class Config:
        from_attributes = True


class AssessmentCreate(BaseModel):
    category: str
    difficulty: str
    total_questions: int
    answered_questions: int
    correct_answers: int
    wrong_answers: int
    unanswered_questions: int
    score: int
    percentage: int


class AssessmentResponse(BaseModel):
    id: int
    category: str
    difficulty: str
    total_questions: int
    answered_questions: int
    correct_answers: int
    wrong_answers: int
    unanswered_questions: int
    score: int
    percentage: int

    class Config:
        from_attributes = True