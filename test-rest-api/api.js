import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req,res)=>{
    return res.status(200).json({message: "API is working!"});
});

app.listen(3000, ()=>console.log("API is listening on port 3000"));