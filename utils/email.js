const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, html) => {
    if (!to) {
        throw new Error("Missing email recipient.");
    }
    try {
        await apiInstance.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER,
                name: "Rentify"
            },
            to: [
                {
                    email: to
                }
            ],
            subject,
            htmlContent: html
        });
        console.log("Email sent successfully.");
    } catch (err) {
        console.error("Brevo API Error:");
        console.error(err.response?.body || err.message);
        throw err;
    }
};
module.exports = sendEmail;