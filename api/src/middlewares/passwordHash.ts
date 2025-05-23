import {
  compareProps,
  createJwtProps,
  hashedPasswordProps,
} from "../types/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";

export const hashPassword = async ({ password }: hashedPasswordProps) => {
  if (!password) {
    throw new Error("le password est obligatoire");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 15);
    if (!hashedPassword) {
      throw new Error("Erreur lors de la generation du hash");
    }
    return hashedPassword;
  } catch (error) {
    console.error("Erreur de hachage", {
      error,
    });

    throw new Error("Echec du cryptage du mot de passe");
  }
};

export const comparePassword = async ({
  userPassword,
  password,
}: compareProps) => {
  try {
    const isMatch = await bcrypt.compare(password, userPassword);

    return isMatch;
  } catch (error) {
    throw new Error("les mot de passes ou email  ne correspond pas");
  }
};

export const createJWT = ({ id }: createJwtProps) => {
  return jwt.sign(
    {
      userId: id,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
