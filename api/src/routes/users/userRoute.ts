import express from 'express';
import * as userController from "../../controllers/users/userController"

const router=express.Router()

router.get('/',userController.getAllUsers)


export default router