const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    if (!to) {
        throw new Error("Missing email recipient.");
    }

    await transporter.sendMail({
        from: `"Rentify" <${process.env.BREVO_SENDER}>`,
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;