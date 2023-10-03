import express from "express";
import dotenv from "dotenv"
import { usersRouter } from "./Routers/users.js";
import cors from "cors";
import { sendMailRouter } from "./Routers/sendMail.js";
import { gamesRouter } from "./Routers/game.js";


// configure the envirenment
dotenv.config()

//initialize express server framework
const PORT=process.env.PORT;
const app=express();

//middleware
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welocome to Project3")
})
app.use("/users",usersRouter)   
app.use("/game",gamesRouter)
app.get("/mail",sendMailRouter)



//listen to a server
app.listen(PORT,()=>console.log( `server started in localhost:9090`));