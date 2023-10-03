
import nodemailer from "nodemailer";

const sendMail = async(req,res)=>{
    
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: 'blake.mills@ethereal.email',
        pass: 'QDm1tFYXuPewf3d3Cs'
        },
      });

      let info = await transporter.sendMail({
        from: '"🏫" <blake.mills@ethereal.email>', // sender address
        to: "diddiq88@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);

    res.json(info);
}

export const sendMailRouter=sendMail;