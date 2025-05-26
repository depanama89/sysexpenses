export const isValidateId=(id:any):boolean=>{
   
    if(typeof id!== "string"){
        return false
    }

    // Tu veux vérifier que la chaîne id contient seulement des chiffres (entier positif, sans signes ou lettres).
    if(!/^\d+$/.test(id)){return false}

    const num=parseInt(id,10)

    if(isNaN(num)|| num <=0){
        return false
    }

    return true

}