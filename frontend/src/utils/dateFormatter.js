export const dateFormatter = (date)=>{
    return (new Date(date).toLocaleDateString("en-US",{
        year : "numeric",
        month: "long",
        day: "numeric"
    })).toString();
}