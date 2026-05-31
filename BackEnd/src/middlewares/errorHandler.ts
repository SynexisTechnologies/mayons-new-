import { Request, Response, NextFunction } from "express";
import { APIError } from "../errors/ApiErrors";
import mongoose from "mongoose";
import fs from "fs";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction

) =>{
   if (res.headersSent) {
    return;
  }


    if(error instanceof APIError){
        console.error(error);
        // expose APIError message to clients (auth errors, validation, etc.)
        res.status(error.status).json({message : error.message || "An unexpected error occurred"});
        return;
    }

    if(error instanceof mongoose.Error){
        console.error(error);
        res.status(400).json({message : error.message})
        return
    }

        // log unexpected errors for debugging
        try {
            const entry = `[${new Date().toISOString()}] ${error.stack || error}\n`;
            fs.appendFileSync("./error_debug.log", entry);
        } catch (e) {
            console.error("Failed to write error log", e);
        }
        console.error(error);
        res.status(500).json({message : "internal Server Error"})
  
}