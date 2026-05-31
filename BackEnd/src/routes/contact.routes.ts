import { Router } from "express";
import { create } from "node:domain";
import { createContact } from "../controllers/contact.controller";

const contactRouter = Router();

contactRouter.post("/send",createContact)


export default contactRouter