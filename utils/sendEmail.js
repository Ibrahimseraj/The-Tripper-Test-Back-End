const nodemailer = require('nodemailer');



module.exports = async (userEmail, subject) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.THE_TRIPPER_EMAIL,
                pass: process.env.THE_TRIPPER_PASSWORD
            }
        });

        const mailOpreation = {
            from: "Logo Team",
            to: userEmail,
            subject: subject,
        }

        const info = await transporter.sendMail(mailOpreation);
    } catch (error) {
        console.log(error);
        throw new Error("Internal server error (nodemailer)")
    }
}