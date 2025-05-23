import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { pool } from "../../db/db";
import { comparePassword, hashPassword } from "../../middlewares/passwordHash";

export const getAllUsers: RequestHandler = async (req, res, next) => {
  console.log("getAllUsers");
  console.log(req.query.id);
  try {
    if (!req.user?.userId) {
      throw createHttpError(401, "Authentification obligatoire");
    }

    const usersQuery = await pool.query({
      text: `SELECT id,firstname,lastname,country,contact FROM tblusers `,
    });

    const users = usersQuery.rows;

    res.status(200).json({
      status: "success",
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

interface changePasswordProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword: RequestHandler<
  unknown,
  unknown,
  changePasswordProps,
  unknown
> = async (req, res, next) => {
  console.log(req.user?.userId);

  try {
    if (!req.user?.userId) {
    throw createHttpError(401, "Authentification obligatoire");
  }
  const { userId, role } = req.user;

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw createHttpError(400, "Tous les champs sont obligatoires");
  }

  if (newPassword !== confirmPassword) {
    throw createHttpError(400, "Les mots de passe ne correspondent pas");
  }

  if (newPassword.length < 6) {
    throw createHttpError(
      400,
      "Le mot de passe doit contenir au moins 6 caractères"
    );
  }

  const userQueryExist = await pool.query({
    text: `SELECT * FROM tblusers WHERE id=$1`,
    values: [userId],
  });

  if (userQueryExist.rowCount === 0) {
    throw createHttpError(404, "Utilisateur non trouvé");
  }

  const user = userQueryExist.rows[0];
  const isPasswordMatch = await comparePassword({
    userPassword: user.password,
    password: currentPassword,
  });

  if (!isPasswordMatch) {
    throw createHttpError(401, "Mot de passe incorrect");
  }

  const hashedPassword = await hashPassword({password:newPassword});

  const updateUserQuery = await pool.query({
    text:`UPDATE tblusers SET password=$1 WHERE id=$2`,
    values:[hashPassword,userId]
  })


  res.status(200).json({
    status: "success",
    message: "Mot de passe modifié avec succès",
    
  })

  } catch (error) {
    next(error);
    
  }};
