import { RequestHandler } from "express";
import { pool } from "../../db/db";
import { getMonthName } from "../../utils/getMonthName";

export const getAllTransactions: RequestHandler = async (req, res, next) => {
  try {
    const today = new Date();
    const _sevenDaysAgo = new Date(today);

    _sevenDaysAgo.setDate(today.getDate() - 7);

    const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];

    const { df, dt, s } = req.query as { df?: string; dt: string; s: string };

    const { userId } = req.user!;

    const startDate = new Date(df || sevenDaysAgo);
    const endDate = new Date(dt || new Date());

    const transactionQuery = await pool.query({
      text: `SELECT * FROM transactions WHERE user_id=$1 AND createdat BETWEEN $2 AND $3 AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' ) ORDER BY id DESC ) `,
      values: [userId, startDate, endDate, s],
    });

    res.status(200).json({
      status: "success",
      data: transactionQuery.rows,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    next(error);
  }
};

export const getDashboardTransactions: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // recuperation de l'id de l'utilisateur
    const { userId } = req.user!;
    // --- 1. Calcul des totaux globaux (Revenus, Dépenses et Solde Disponible) ---
    // Cette requête SQL calcule directement les totaux de revenus et dépenses en une seule fois.
    const totalsResult = await pool.query({
      text: `SELECT
        ------Sum avec filtre pour les revenus COALESCE remplace Null par 0 si aucune transaction de revenue
        COALESCE(SUM(amount) FILTER (WHERE type='income'),0) as totalIncome,
        ------Sum avec filtre pour les dépenses COALESCE remplace Null par 0 si aucune transaction de dépense
        COALESCE(SUM(amount) FILTER (WHERE type_transaction='expense'),0) as totalExpense
        FROM tbltransaction
        WHERE user_id=$1
        `,
      values: [userId],
    });

    // destructuration des resultats de la requete
    const {totalIncome,totalExpense}=totalsResult.rows[0];
    const availableBalance=totalIncome-totalExpense

    const year=new Date().getFullYear()
    const startDate=new Date(year,0,1)
    const endDate=new Date(year,11,31,59,59)

    // recuperation des donnees menseulles 
    // requete SQL qui renvoie une ligne par mois avec les totaux de revenue et de depense

    const monthlyResult=await pool.query({
        text:`SELECT 
        EXTRACT(MONTH FROM createdat)::INTEGER AS month,
        COALESCE(SUM(amount) FILTER (WHERE type_transaction='income'),0) as totalIncome,
        COALESCE(SUM(amount) FILTER (WHERE type_transaction='expense'),0) as totalExpense 
        FROM tbltransaction
        WHERE user_id=$1 AND createdat BETWEEN $2 AND $3
        GROUP BY EXTRACT(MONTH FROM createdat)
        ORDER BY month`,
        values:[userId,startDate,endDate]
    })

    // --- 4. Transformation des Données Mensuelles pour le Graphique (Traitement JS simplifié) ---
        // Crée une Map pour un accès rapide aux données de chaque mois (très efficace)
       const monthlyDataMap=new Map(monthlyResult.rows.map(row=>[row.month,row])) 
   
    // Crée un tableau de 12 mois avec des données par défaut
    const chartData=Array.from({length:12},(_,index)=>{
        const monthNumber=index+1
        const monthRow=monthlyDataMap.get(monthNumber) || {}

        return {
            label:getMonthName(index),
            income:parseFloat(monthRow.totalIncome ?? 0),
            expense:parseFloat(monthRow.totalExpense ?? 0)
        }
    })

    // --- 5. Récupération des Dernières Transactions et Comptes (Pas de changement nécessaire) ---
    const [lastTransactionResult,lastAccountResult]=await Promise.all([
        pool.query({
            text:`SELECT*FROM tbltransaction WHERE user_id=$1 ORDER BY createdat DESC LIMIT 5`,
            values: [userId]
        }),
        pool.query(({
            text:`SELECT * FROM tblaccount WHERE user_id=$1 ORDER BY createdat DESC LIMIT 5`,
            values: [userId]
        }))

    ])


    res.status(200).json({
        status:"success",
        availableBalance,
        totalIncome,
        totalExpense,
        chartData: chartData,
        lastTransactions: lastTransactionResult.rows, 
        lastAccounts: lastAccountResult.rows

    })
  } catch (error) {
    console.error("Error fetching dashboard transactions:", error);
    next(error);
  }
};

export const getTransactionById: RequestHandler = async (req, res, next) => {};

export const createTransaction: RequestHandler = async (req, res, next) => {};

export const updateTransaction: RequestHandler = async (req, res, next) => {};
export const deleteTransaction: RequestHandler = async (req, res, next) => {};
