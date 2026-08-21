from sqlalchemy.orm import Session
import models
import schemas
import random


def create_question(
    db: Session,
    question: schemas.QuestionCreate
):
    db_question = models.Question(
        question_text=question.question_text,
        category=question.category,
        option_a=question.option_a,
        option_b=question.option_b,
        option_c=question.option_c,
        option_d=question.option_d,
        correct_answer=question.correct_answer,
        difficulty=question.difficulty
    )

    db.add(db_question)
    db.commit()
    db.refresh(db_question)

    return db_question


def get_questions(db: Session):
    return db.query(models.Question).all()


def get_question(
    db: Session,
    question_id: int
):
    return db.query(models.Question).filter(
        models.Question.id == question_id
    ).first()


def update_question(
    db: Session,
    question_id: int,
    question: schemas.QuestionCreate
):
    db_question = db.query(models.Question).filter(
        models.Question.id == question_id
    ).first()

    if db_question is None:
        return None

    db_question.question_text = question.question_text
    db_question.category = question.category
    db_question.option_a = question.option_a
    db_question.option_b = question.option_b
    db_question.option_c = question.option_c
    db_question.option_d = question.option_d
    db_question.correct_answer = question.correct_answer
    db_question.difficulty = question.difficulty

    db.commit()
    db.refresh(db_question)

    return db_question


def delete_question(
    db: Session,
    question_id: int
):
    db_question = db.query(models.Question).filter(
        models.Question.id == question_id
    ).first()

    if db_question is None:
        return None

    db.delete(db_question)
    db.commit()

    return db_question


def get_random_assessment_questions(db: Session):
    quantitative = db.query(models.Question).filter(
        models.Question.category == "Quantitative"
    ).all()

    logical = db.query(models.Question).filter(
        models.Question.category == "Logical Reasoning"
    ).all()

    verbal = db.query(models.Question).filter(
        models.Question.category == "Verbal Ability"
    ).all()

    if len(quantitative) < 5:
        raise ValueError(
            "At least 5 Quantitative questions are required"
        )

    if len(logical) < 5:
        raise ValueError(
            "At least 5 Logical Reasoning questions are required"
        )

    if len(verbal) < 5:
        raise ValueError(
            "At least 5 Verbal Ability questions are required"
        )

    selected_questions = (
        random.sample(quantitative, 5)
        + random.sample(logical, 5)
        + random.sample(verbal, 5)
    )

    random.shuffle(selected_questions)

    return selected_questions


def create_assessment(
    db: Session,
    assessment: schemas.AssessmentCreate
):
    db_assessment = models.Assessment(
        category=assessment.category,
        difficulty=assessment.difficulty,
        total_questions=assessment.total_questions,
        answered_questions=assessment.answered_questions,
        correct_answers=assessment.correct_answers,
        wrong_answers=assessment.wrong_answers,
        unanswered_questions=assessment.unanswered_questions,
        score=assessment.score,
        percentage=assessment.percentage
    )

    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)

    return db_assessment


def get_assessments(db: Session):
    return db.query(models.Assessment).all()