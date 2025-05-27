export const getMonthName=(monthIndex:number):string=>{

    const date=new Date()
    date.setMonth(monthIndex)
    return date.toLocaleString('fr-Fr',{month:'long'})
}