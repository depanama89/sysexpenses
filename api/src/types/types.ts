export interface signUp {
  firstname: string;
  lastname: string;
  email: string;
  contact: number;
  password: string;
  country: string;
}

export interface loginProps {
  email: string;
  password: string;
}

export interface hashedPasswordProps {
  password: string;
}

export interface compareProps {
  userPassword: string;
  password: string;
}

export interface createJwtProps {
  id: string;
}
