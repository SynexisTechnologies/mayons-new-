import { Router } from "express";
import { createAddress, getUserAddresses, updateAddress } from "../controllers/address.controller";
import { authenticateToken } from "../middlewares/authenticateToken";


const addressRouter = Router()

addressRouter.post("/create",authenticateToken,createAddress)
addressRouter.get("/user",authenticateToken,getUserAddresses)
addressRouter.put("/update/:id",authenticateToken,updateAddress)


export default addressRouter;