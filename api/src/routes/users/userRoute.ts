import express from 'express';
import * as userController from "../../controllers/users/userController"

const router=express.Router()

router.get('/',userController.getAllUsers)
router.put("/change-password",userController.changePassword)
router.put("/update",userController.updateUser)
router.delete("/:id",userController.deleteUser)


export default router