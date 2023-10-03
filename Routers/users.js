import express from "express"
import { addRandomString, addUsers, deleteRandomString, generateJwtToken, getRandom, getUser, updatePassword } from "../Controllers/users.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
import nodemailer from "nodemailer";

const router=express.Router();

router.post("/signup",async(req,res)=>{
    try {
        //genarate slat
        const salt= await bcrypt.genSalt(10)

        const user=await getUser(req.body.email);
        if(!user){
            const hashedPassword=await bcrypt.hash(req.body.password, salt)
            const hashedUser=await {...req.body,password: hashedPassword}
            const result= await addUsers(hashedUser);
            return res.status(200).json({result:result,data:"Added"})
        }
        res.status(400).json({data:"Given email already exist"}) 
    } catch (error) {
        res.status(500).json("internal server error");
    }
})

router.post("/login",async(req,res)=>{
    try {
      console.log("inside")
        //is user available 
        const user =await getUser(req.body.email)
        if(!user){
        return res.status(400).json({data:"invalid"})
        }
        //is password valid
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if(!validPassword){
            return res.status(400).json({data:"invalid"})
        }
        const token =generateJwtToken(user._id)
        res.status(200).json({data:token,name:user.name,id:user._id,email:user.email,})


    } catch (error) {
        res.status(500).json("internal server error");   
    }
})


router.post("/checkstring", async (req, res) => {
    
  
    try {
      //  if the token matches the stored random string
      const isValidToken = await getRandom(req.query.token);
      if (!isValidToken) {
        return res.status(400).json({ data: "invalid token" });
      }
  
     
  
      res.status(200).json({ data: isValidToken });
    } catch (error) {
      res.status(500).json("internal server error");
    }
  });

router.post("/checkmail",async(req,res)=>{
    try {
        //is user available 
        const user =await getUser(req.body.email)
        if(!user){
        return res.status(400).json({data:"invalid"})
        }
       
        
        const randomString = crypto.randomBytes(20).toString('hex');

    const result =await addRandomString(randomString,req.body.email)


    // create the link with the random string
    const link = `https://ornate-duckanoo-99a24c.netlify.app/resetpassword?token=${randomString}&role=users`;

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: 'blake.mills@ethereal.email',
        pass: 'QDm1tFYXuPewf3d3Cs'
      },
    });

    let info = await transporter.sendMail({
      from: '"pizza 👻" <blake.mills@ethereal.email>', // sender address
      to: req.body.email, // list of receivers
      subject: "Reset Password", // Subject line
      text: `Click the following link to reset your password: ${link}`, // plain text body
      html: `<p>Click the following link to reset your password:</p><a href="${link}">${link}</a>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

    res.json(info);
  } catch (error) {
    res.status(500).json("internal server error");
  }
})


router.post("/reset-password", async (req, res) => {
    try {
      const { email, password, token } = req.body;
  
      // verify the token and email
      const isValidToken = await getRandom(token);
      const user = await getUser(email);
  
      if (!isValidToken || !user) {
        return res.status(400).json({ data: "Invalid token or email" });
      }
  
      // generate a new salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // update the user's password in the database
      const result=await updatePassword(email,hashedPassword)
  
      // delete the used token from the randomstring collection
       deleteRandomString(token)
      
  
      res.status(200).json({ data: "Password reset successful" });
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  });
  



export const usersRouter = router;
