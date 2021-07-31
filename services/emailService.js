const nodemailer=require('nodemailer');

function sendMail({from,to,subject,text,html}){
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    });
        let info=await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        })
}


module.exports=sendMail;