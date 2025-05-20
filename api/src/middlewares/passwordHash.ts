import { hashedPasswordProps } from "../types/types";
import bcrypt from "bcrypt";
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
