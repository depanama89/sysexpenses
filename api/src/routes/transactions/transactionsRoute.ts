import express from "express"
import * as transactionController from "../../controllers/transactions/transctions"


const router= express.Router()

router.get("/",transactionController.getAllTransactions)
router.get("/:id", transactionController.getTransactionById)
router.post("/create", transactionController.createTransaction)
router.patch("/update/:id", transactionController.updateTransaction) 
router.delete("/delete/:id", transactionController.deleteTransaction)





export default router