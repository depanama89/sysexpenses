import { RequestHandler } from "express";
import JWT from "jsonwebtoken"
import env from "../utils/validateEnv"
import createHttpError from "http-errors";
const authMiddleware:RequestHandler = (req, res, next) => {
    try {
        const authheader=req.headers.authorization
        if(!authheader || !authheader.startsWith('Bearer')){
            res.status(401).json({
                status:"auth_failed",
                message:"authentification failed"
            })
            return
        }

        const token=authheader.split(" ")[1]

       const decoded=JWT.verify(token,env.JWT_SECRET )as {userId:string,role:string} 

       if(!decoded.userId){
        throw new Error("Token malformé")
       }
       req.user={
        userId:decoded.userId,
        role:decoded.role
       }

       next()
        
    } catch (error) {
        next(createHttpError(401,"Token invalide"))
        
    }
}

export default authMiddleware