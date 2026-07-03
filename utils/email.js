const axios = require("axios");

const sendEmail = async (to, subject, html) => {

    if (!to) {
        throw new Error("Missing email recipient.");
    }

    try {

        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Rentify",
                    email: process.env.BREVO_SENDER
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject,
                htmlContent: html
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Email sent successfully");
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }
};
module.exports = sendEmail;