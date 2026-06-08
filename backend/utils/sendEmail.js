const nodeMailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, '');

        if (!emailUser || !emailPass) {
            throw new Error('Email credentials are missing');
        }

        const transporter = nodeMailer.createTransport({
            service: 'Gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
        const mailOptions = {
            from: emailUser,
            to,
            subject,
            text,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error.message);

        if (error.code === 'EAUTH' && process.env.NODE_ENV !== 'production') {
            console.log(`[DEV EMAIL FALLBACK] To: ${to}`);
            console.log(`[DEV EMAIL FALLBACK] Subject: ${subject}`);
            console.log(`[DEV EMAIL FALLBACK] Message: ${text}`);
            return;
        }

        const emailError = new Error('Email could not be sent');
        emailError.code = error.code || 'EMAIL_SEND_FAILED';
        throw emailError;
    }
};
module.exports = sendEmail;
