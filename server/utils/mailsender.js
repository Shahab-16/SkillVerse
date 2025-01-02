var nodemailer = require('nodemailer');

exports.mailSender = async (email,title,body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,    
                pass: process.env.MAIL_PASS,
            },
            secure:false,
        });
        const info = await transporter.sendMail({
            from: `"TechHub" | <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            text: body,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.log(error);
        return error.message;
    }
}
