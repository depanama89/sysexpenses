import express from "express"
import * as accountController from "../../controllers/accounts/account"


const router=express.Router()

router.get("/",accountController.getAllAccounts)
router.get("/:id", accountController.getAccountById)
router.post("/create", accountController.createAccount)
router.patch("/update/:id", accountController.updateAccount)
router.delete("/delete/:id", accountController.deleteAccount)


export default router