from sqlalchemy.orm import Session
import models
import schemas


def create_question(db: Session, question: schemas.QuestionCreate):
    db_question = models.Question(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def get_questions(db: Session):
    return db.query(models.Question).all()


def get_question(db: Session, question_id: int):
    return db.query(models.Question).filter(models.Question.id == question_id).first()


def update_question(db: Session, question_id: int, question: schemas.QuestionCreate):
    db_question = get_question(db, question_id)

    if db_question:
        for key, value in question.model_dump().items():
            setattr(db_question, key, value)

        db.commit()
        db.refresh(db_question)

    return db_question


def delete_question(db: Session, question_id: int):
    db_question = get_question(db, question_id)

    if db_question:
        db.delete(db_question)
        db.commit()

    return db_question