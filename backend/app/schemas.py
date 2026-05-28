from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ProgramType = Literal["selective", "non_selective"]


class SchoolOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    uai_code: str | None = None
    city: str | None = None
    region: str | None = None


class GradeIn(BaseModel):
    subject: str
    value: float = Field(ge=0, le=20)
    period: str | None = None


class GradeOut(GradeIn):
    model_config = ConfigDict(from_attributes=True)

    id: int


class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str = Field(min_length=6)
    track: str | None = None
    school_id: int | None = None


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    email: str
    track: str | None = None
    school_id: int | None = None
    grades: list[GradeOut] = []


class ProgramBase(BaseModel):
    name: str
    institution: str
    type: ProgramType
    domain: str | None = None
    city: str | None = None
    region: str | None = None
    capacity: int | None = None
    admission_rate: float | None = Field(default=None, ge=0, le=1)
    min_average: float | None = Field(default=None, ge=0, le=20)
    key_subjects: dict[str, float] = {}


class ProgramCreate(ProgramBase):
    pass


class ProgramOut(ProgramBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class LoginIn(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ApplicationCreate(BaseModel):
    program_id: int


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    program_id: int
    status: str
    score_snapshot: float | None = None


class CandidateOut(BaseModel):
    application_id: int
    student_name: str
    student_school: str | None = None
    student_track: str | None = None
    program_id: int
    program_name: str
    program_type: ProgramType
    score: float | None = None
    status: str


class MatchResult(BaseModel):
    program: ProgramOut
    score: float
    confidence_low: float
    confidence_high: float
    category: ProgramType
    eligible: bool
    rationale: str
