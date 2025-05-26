import { RequestHandler } from "express"
import { pool } from "../db/db"

interface CheckPermissionsMiddleware {
    permissions: string
}

const checkPermissionsMiddleware:RequestHandler<unknown,unknown,CheckPermissionsMiddleware,unknown> = async(req,res,next) => {
    const user=req.user

    if(!user){
        throw new Error("Vous devez vous connecter d'abord")
    }

    const permission= await getUserPermission(user.userId)
    if(!(permission).includes(user.role)){
        res.status(403).json({
            status:"forbidden",
            message:"Vous n'avez pas la permission d'effectuer cette action"
        })
    }
}

const getUserPermission = async (userId: string) => {
    const query=`SELECT p.name as permission  FROM tblpermissions p
     JOIN tblrole_permissions rp ON p.id=rp.permission_id 
     JOIN tbluser_roles ur ON  ur.role_id=rp.role_id
     WHERE ur.user_id=$1`;
    const result= await pool.query({
        text:query,
        values:[userId]
    })

    return result.rows.map((row) => row.permission)
}