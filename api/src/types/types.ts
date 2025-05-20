export interface signUp {
  fisrtname: string;
  lastname: string;
  email: string;
  contact: number;
  password: string;
  country: string;
}

export interface login {
  email: string;
  password: string;
}

export interface hashedPasswordProps {
  password: string;
}
