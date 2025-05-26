import { RequestHandler } from "express";
import { accountProps } from "../../types/types";
import { pool } from "../../db/db";
import createHttpError from "http-errors";
import { generateAccountNumber } from "../../services/servicesAccountGenerator";
import { isValidateId } from "../../services/validateId";

export const createAccount: RequestHandler = async (req, res, next) => {
  const { account_name, account_balance, type, category_id } = req.body;
  const user = req.user?.userId;

  try {
    if (!account_name || !account_balance == undefined || !type) {
      throw createHttpError("All fields are required");
    }

    const account_number = await generateAccountNumber();

    const accountQuery = await pool.query({
      text: `SELECT EXISTS (SELECT* FROM tblaccounts WHERE account_name=$1 and user_id=$2) `,
      values: [account_name, user],
    });

    if (accountQuery.rows[0].exists) {
      throw next(createHttpError(400, "le compte existe déjà"));
    }

    const newAccount = await pool.query({
      text: `INSERT INTO tblaccounts (user_id, account_name, account_number, account_balance, type) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      values: [user, account_name, account_number, account_balance, type],
    });
    const DEFAULT_INITIAL_DEPOSIT_CATEGORY_ID = 1;
    const account = newAccount.rows[0];

    const description = account.account_name + "(initial deposit)";
    const initialDepositQuery = {
      text: `INSERT INTO tbltransaction (user_id,description,status,category_id,account_id,amount,type_transaction) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      values: [
        user,
        description,
        "Completed",
        DEFAULT_INITIAL_DEPOSIT_CATEGORY_ID,
        newAccount.rows[0].id,
        account_balance,
        "depot",
      ],
    };
    await pool.query(initialDepositQuery);

    res.status(201).json({
      message: "Account created successfully",
      account: newAccount.rows[0],
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getAllAccounts: RequestHandler = async (req, res, next) => {
  try {
    const acountQuery = await pool.query({
      text: `SELECT*FROM tblaccounts  ORDER BY createdat DESC`,
    });
    // Logic to get all accounts
    res
      .status(200)
      .json({
        message: "All accounts retrieved successfully",
        data: acountQuery.rows,
      });
  } catch (error) {
    next(error);
  }
};

export const getAccountById: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const userIdNumber = req.params.id;
  try {
    // const id = req.params.id;
    // Logic to get account by ID

    if (!userId) {
      throw createHttpError(
        401,
        "vous devez être connecté pour accéder à cette ressource"
      );
    }

    const queryAccount = await pool.query({
      text: `SELECT*FROM tblaccounts WHERE id=$1`,
      values: [userIdNumber],
    });

    if (queryAccount.rowCount === 0) {
      throw createHttpError(
        404,
        `le compte avec l'ID ${userIdNumber} n'existe pas `
      );
    }
    res
      .status(200)
      .json({
        message: `Account with ID ${userIdNumber} retrieved successfully`,
        data: queryAccount.rows,
      });
  } catch (error) {
    next(error);
  }
};

export const updateAccount: RequestHandler = async (req, res, next) => {
  const { userId } = req.user!;
 const {id}=req.params
  

  try {

    if (!userId) {
      throw createHttpError(
        401,
        "vous devez être connecté pour accéder à cette ressource"
      );
    }
    if(!isValidateId(id)){
      throw createHttpError(400, "l'ID doit être un nombre valide");
    }
    
 const { account_name , account_balance, type } = req.body;
   
    // if (!account_name || !account_balance == undefined || !type) {
    //   throw createHttpError(400, "All fields are required");
    // }
    const accountQueryExist = await pool.query({
      text: `SELECT EXISTS (SELECT* FROM tblaccounts WHERE id=$1 )`,
      values: [id],
    });

    if (!accountQueryExist.rows[0].exists) {
      throw createHttpError(
        404,
        `le compte avec l'ID ${id} n'existe pas `
      );
    }

    const updatedAccount = await pool.query({
      text: `UPDATE tblaccounts SET account_name=$1,account_balance=$2,type=$3,updatedat=CURRENT_TIMESTAMP WHERE id=$4 RETURNING * `,
      values: [account_name, account_balance, type, id],
    });
    // Logic to update account by ID
    res
      .status(200)
      .json({
        message: `Account with ID ${id} updated successfully`,
        data: updatedAccount.rows,
      });
  } catch (error) {
    next(error);
  }
};


// function to add money to an account by ID

export const addMoneyToAccount:RequestHandler=async(req,res,next)=>{
  const { userId}=req.user!

// params parameter ID
const {id}=req.params
const {amount}=req.body

const NewMount=Number(amount)

const result= await pool.query({
  text:`UPDATE tblaccounts SET account_balance=account_balance +$1, updatedat=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`,
  values:[NewMount,id]

})
}

// function to delete an account by ID

export const deleteAccount: RequestHandler = async (req, res, next) => {
  try {
    const { userId}=req.user!;

    const {id} = req.params;
    // Logic to delete account by ID

    const accountQueryExist=await pool.query({
      text:`SELECT EXISTS (SELECT*FROM tblaccounts WHERE id=$1)`,
      values:[id]
    })
    
    if(!accountQueryExist.rows[0].exists){
      throw createHttpError(404,`le compte avec l'iD ${id} n'existe pas`)
    }

    await pool.query({
      text:`DELETE FROM tblaccounts WHERE id=$1`,
      values:[id]
    })

    res
      .status(200)
      .json({ message: `Account with ID ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
