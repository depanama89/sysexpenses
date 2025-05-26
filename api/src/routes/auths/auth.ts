import express from "express";
import * as AuthController from "../../controllers/authController/auth";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/role",authMiddleware, AuthController.role);
router.post("/permission",authMiddleware, AuthController.permission);
router.post("/user_role", authMiddleware,AuthController.userRole);
// router.post("/user_permission", AuthController.userPermission);

export default router;
