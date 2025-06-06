import { api } from "../../api/api"

export const getAllAccessories=async()=>{
    return api.get("/api/accessory/");
}