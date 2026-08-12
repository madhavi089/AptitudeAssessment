from sqlalchemy import Column, Integer, String, Text, CHAR, Boolean, TIMESTAMP, ForeignKey
from database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    correct_answer = Column(CHAR(1), nullable=False)
    difficulty = Column(String(20))


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    difficulty = Column(String)
    total_questions = Column(Integer)
    answered_questions = Column(Integer)
    correct_answers = Column(Integer)
    wrong_answers = Column(Integer)
    unanswered_questions = Column(Integer)
    score = Column(Integer)
    percentage = Column(Integer)


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_answer = Column(CHAR(1))
    is_correct = Column(Boolean)