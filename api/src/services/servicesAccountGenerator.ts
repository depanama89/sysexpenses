import { pool } from "../db/db"

interface incrementProps{
    account_number:string
}
export const generateAccountNumber = async():Promise<string>=>{
const lastAccount = await pool.query({
        text: `SELECT account_number FROM tblaccounts ORDER BY id DESC LIMIT 1`
    });

    // Si aucun compte existe
    if (lastAccount.rowCount === 0) {
        return "1001000000"; // Numéro de départ
    }

    // Conversion sécurisée en nombre
    const accountNumberFromDb = lastAccount.rows[0].account_number;
    
    const lastNumber = parseInt(accountNumberFromDb, 10);

    // Vérification que la conversion a réussi
    if (isNaN(lastNumber)) {
        throw new Error("Le numéro de compte existant n'est pas valide");
    }

    // Incrément et retour comme string
    return (lastNumber + 1).toString();
};

    


