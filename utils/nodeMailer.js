const nodemailer  = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendActivationEmail = async (email, token) => {
    const activationLink = `http://localhost:3000/activate-account/${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Activate your account',
        html: `<p>Click <a href="${activationLink}">here</a> to activate your account.</p>
            <p>Note this link is alive only till 14 days </p>
        `,
    });
};

const forgotPasswordEmail = async (email, token)=>{
    const activationLink = `http://localhost:3000/resetPassword/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password reset link',
        html: `<p>Click <a href="${activationLink}">here</a> to Reset your password.</p>
            <p>Note this link is alive only for a day </p>
        `,
    });
}

module.exports = { sendActivationEmail, forgotPasswordEmail };
