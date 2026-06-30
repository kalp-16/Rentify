const sendEmail = require("./email");

const sendResetPasswordEmail = async (user, token) => {

    const resetUrl =
        `${process.env.BASE_URL}/reset-password/${token}`;

    const html = `
    <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;padding:40px;border-radius:12px;border:1px solid #eeeeee;">

        <h2 style="color:#ff385c;text-align:center;">
            Reset Your Rentify Password
        </h2>

        <p>Hi <strong>${user.fullName}</strong>,</p>

        <p>
            We received a request to reset your Rentify password.
            Click the button below to create a new password.
        </p>

        <div style="text-align:center;margin:40px 0;">

            <a
                href="${resetUrl}"
                style="
                background:#ff385c;
                color:white;
                text-decoration:none;
                padding:14px 28px;
                border-radius:8px;
                display:inline-block;
                ">

                Reset Password

            </a>

        </div>

        <p style="font-size:14px;color:#666;">
            This link expires in 1 hour.
        </p>

        <hr>

        <p style="font-size:13px;color:#999;">
            If you didn't request this password reset,
            you can safely ignore this email.
        </p>

    </div>
    `;
    await sendEmail(
        user.email,
        "Reset your Rentify password",
        html
    );
};
module.exports = sendResetPasswordEmail;