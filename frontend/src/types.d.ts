export interface authToken {
  access?: string;
  refresh?: string;
}

export interface UserToken {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
  is_student: boolean;
  nombre?: string;
  apellido?: string;
  pic?: string;
}

export interface PrivateRoutesProps {
  children: React.ReactNode;
}

export interface Alumno {
  user: string;
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  curso: string;
  año: string;
  pic: string;
}

export interface AlumnoErrors {
  nombre: Array;
  apellido: Array;
  dni: Array;
  curso: Array;
  año: Array;
  email: Array;
  password: Array;
  repeat_password: Array;
  pic: Array;
}

export interface Respuesta {
  id: number;
  respuesta: string;
  correcta: boolean;
}

export interface Pregunta {
  id: number;
  pregunta: string;
  puntaje: number;
  respuestas: Respuesta[];
  examen: number;
}

export interface Examen {
  id: number;
  title: string;
  curso: string;
  año: string;
  materia: string;
  image?: string;
  start: Date;
  end: Date;
  created_at: Date;
  max_nota: number;
  slug: string;
  is_done: boolean;
}

export interface ExamenPreguntas {
  id: number;
  title: string;
  max_nota: number;
  start: Date;
  end: Date;
  preguntas: Pregunta[];
  image: string;
  materia: string;
  curso: string;
  año: string;
  slug: string;
  is_done: boolean;
}

export interface AlumnoExamen {
  id: number;
  alumno: number;
  examen: number;
  nota: number;
}

export interface ProtectedRespuestas {
  id: number;
  respuesta: string;
}

export interface Question {
  id: number;
  pregunta: string;
  puntaje: number;
  respuestas: ProtectedRespuestas[];
}

export interface QuestionAnswers {
  pregunta: number;
  respuestas: number[];
}

export interface AlumnoQuiz {
  id: number;
  alumno: number;
  pregunta: string;
  puntaje: number;
  correct_answer: boolean;
  respuestas: ProtectedRespuestas[];
  alumno_answers: number[];
}

export interface FinishQuiz {
  nota: number;
  quiz: AlumnoQuiz[];
}
