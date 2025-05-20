import { RequestHandler } from "express";
import { signUp } from "../../types/types";
import createHttpError from "http-errors";
import { pool } from "../../db/db";
import { hashPassword } from "../../middlewares/passwordHash";

export const login: RequestHandler = async (req, res, next) => {};
export const signup: RequestHandler<unknown, unknown, signUp, unknown> = async (
  req,
  res,
  next
) => {
  // recuperation de donnees du formulaire

  const { email, fisrtname, lastname, contact, password, country } = req.body;

  // verification de champs

  try {
    if (!(email || fisrtname || lastname || contact || password || country)) {
      throw next(createHttpError(400, "Remplir les champs vides"));
    }

    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM tblusers WHERE email=$1)",
      values: [email],
    });

    if (userExist.rows[0].exists) {
      throw next(createHttpError(400, "c'est utilisateur existe deja"));
    }

    const hashedPassword = await hashPassword({ password });

    const newUser = await pool.query(
      `
        INSERT INTO tblusers (email,firstname,lastname,contact,password,country)VALUES($1,$2,$3,$4,$5,$6) RETURNING id,email,firstname,lastname,contact,country`,
      [email, fisrtname, lastname, contact, hashedPassword, country]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const logout = () => {};
