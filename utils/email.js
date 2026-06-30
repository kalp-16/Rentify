const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify SMTP connection once when the app starts
transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP Error:", err);
    } else {
        console.log("SMTP Connected");
    }
});

const sendEmail = async (
    to,
    subject,
    html
) => {
    if (!to) {
        throw new Error("Missing email recipient.");
    }
    await transporter.sendMail({
        from: `"Rentify Notifications" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
};
module.exports = sendEmail;