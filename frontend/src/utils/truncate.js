export const truncate = (item,lenght)=>{
    return item.length > lenght ? item.substring(0,lenght) + '...' : item
}