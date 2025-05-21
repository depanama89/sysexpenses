import { RequestHandler } from "express";
import { loginProps, signUp } from "../../types/types";
import createHttpError from "http-errors";
import { pool } from "../../db/db";
import {
  comparePassword,
  createJWT,
  hashPassword,
} from "../../middlewares/passwordHash";
import { token } from "morgan";

export const login: RequestHandler<
  unknown,
  unknown,
  loginProps,
  unknown
> = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw createHttpError(400, "Email and password est obligatoire");
    }

    const result = await pool.query({
      text: `SELECT * FROM tblusers WHERE email=$1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      throw createHttpError(401, "Invalid passwor ou email");
    }

    const isMatch = await comparePassword({
      userPassword: user.password,
      password: password,
    });

    // verification du mot de passe
    if (!isMatch) {
      throw createHttpError(401, "mot de passe ne correspond");
    }

    const token = createJWT({ id: user.id });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 86400 * 1000,
    });

    user.password = undefined;

    res.status(200).json({
      message: "login se fait avec success",
      user,
      token,
    });
  } catch (error) {
    next(createHttpError(500, "Impossible de se connecter"));
  }
};

export const signup: RequestHandler<unknown, unknown, signUp, unknown> = async (
  req,
  res,
  next
) => {
  // recuperation de donnees du formulaire

  const { email, firstname, lastname, contact, password, country } = req.body;

  // verification de champs

  try {
    if (!(email || firstname || lastname || contact || password || country)) {
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
      [email, firstname, lastname, contact, hashedPassword, country]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const logout = () => {};
