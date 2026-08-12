from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import crud

from database import engine, Base, get_db


app = FastAPI(title="Aptitude Assessment API")

Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Aptitude Assessment API is Running"
    }


@app.post(
    "/questions",
    response_model=schemas.QuestionResponse
)
def create_question(
    question: schemas.QuestionCreate,
    db: Session = Depends(get_db)
):
    return crud.create_question(db, question)


@app.get(
    "/questions",
    response_model=list[schemas.QuestionResponse]
)
def get_questions(
    db: Session = Depends(get_db)
):
    return crud.get_questions(db)


@app.get(
    "/questions/{question_id}",
    response_model=schemas.QuestionResponse
)
def get_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    question = crud.get_question(db, question_id)

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return question


@app.put(
    "/questions/{question_id}",
    response_model=schemas.QuestionResponse
)
def update_question(
    question_id: int,
    question: schemas.QuestionCreate,
    db: Session = Depends(get_db)
):
    updated = crud.update_question(
        db,
        question_id,
        question
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return updated


@app.delete(
    "/questions/{question_id}"
)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_question(
        db,
        question_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {
        "message": "Question deleted successfully"
    }


@app.post(
    "/assessments",
    response_model=schemas.AssessmentResponse
)
def create_assessment(
    assessment: schemas.AssessmentCreate,
    db: Session = Depends(get_db)
):
    return crud.create_assessment(
        db,
        assessment
    )


@app.get(
    "/assessments",
    response_model=list[schemas.AssessmentResponse]
)
def get_assessments(
    db: Session = Depends(get_db)
):
    return crud.get_assessments(db)