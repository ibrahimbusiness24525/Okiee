const { default: axios } = require("axios")
const {user}= localStorage.getItem("user")

export const api =  axios.create({
    baseURL: "http://localhost:8000/",
    headers:{
        "Content-Type":"application/json",
        "user-id": user._id,
    }
})