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

interface PrivateRoutesProps {
  children: React.ReactNode;
}

interface Alumno {
  user: string;
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  curso: string;
  año: string;
  pic: string;
}

interface AlumnoErrors {
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
