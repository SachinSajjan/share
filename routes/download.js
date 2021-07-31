const router=require('express').Router();
const File=require('../models/file');

router.get('/:uuid',async(req,res)=>{
    const file=await File.findOne({uuid:req.params.uuid});

    if(!file){
        return res.render('download',{error:'Link has been expired.'})
    }

    const filePath=`${__dirname}/../${file.path}`;
    res.download(filePath);
})



router.post('/send',async(req,res)=>{
    const {uuid,emailTo,emailFrom}=req.body;

    //validate request
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:'All fields are required'});
    }


    //get data from database
    const file=await File.findOne({uuid:uuid});
    
    if(file.sender){
        return res.status(422).send({error:'Already file sent.'});
    }

    file.sender=emailFrom;
    file.receiver=emailTo;
    const response=await file.save();


    //send email
    const sendMail=require('../services/emailService');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'file sharing',
        text:`${emailFrom} shared a file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+'KB',
            expires:'24 hours'
        })
    });

    return res.send({success:true})


})

module.exports=router;