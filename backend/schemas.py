from pydantic import BaseModel


class QuestionBase(BaseModel):
    question_text: str
    category: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    difficulty: str


class QuestionCreate(QuestionBase):
    pass


class QuestionResponse(QuestionBase):
    id: int

    class Config:
        from_attributes = True