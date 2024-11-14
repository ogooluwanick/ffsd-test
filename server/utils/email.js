import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {

        const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                        user: process.env.NODEMAIL_EMAIL ,
                        pass: process.env.NODEMAIL_PASS ,
                }
        })

        const mailOpts ={
                from: process.env.NODEMAIL_EMAIL ,
                to: process.env.NODEMAIL_EMAIL
        }

        const verificationLink = `${process.env.FRONTEND_URL}/email-verification?token=${token}`;

        await transporter.sendMail({
                from: process.env.NODEMAIL_EMAIL,
                to: email,
                subject: 'Verify your email',
                html: `
                                <h1>Email Verification</h1>
                                <p>Please click the link below to verify your email address:</p>
                                <a href="${verificationLink}">${verificationLink}</a>
                                <p>This link will expire in 24 hours.</p>
                        `
        });
};