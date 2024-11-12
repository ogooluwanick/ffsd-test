import express from "express";
import expressAsyncHandler from "express-async-handler"
import mongoose from "mongoose";

const router = express.Router();

router.get("/",expressAsyncHandler(async(req,res)=> {
        
}))

export default router;
