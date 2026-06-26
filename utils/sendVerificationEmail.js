const sendEmail = require("./email");

const sendVerificationEmail = async (
    user,
    token
) => {

    const verifyUrl =
        `http://localhost:8080/verify/${token}`;

    const html = `
    <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;padding:40px;border-radius:12px;border:1px solid #eeeeee;">

        <h2 style="color:#ff385c;text-align:center;">
            Welcome to Rentify 🎉
        </h2>

        <p style="font-size:16px;">
            Hi <strong>${user.fullName}</strong>,
        </p>

        <p style="font-size:16px;line-height:1.7;">
            Thank you for creating your Rentify account.
            Before you can login, please verify your email address.
        </p>

        <div style="text-align:center;margin:40px 0;">

            <a
                href="${verifyUrl}"
                style="
                background:#ff385c;
                color:white;
                text-decoration:none;
                padding:14px 28px;
                border-radius:8px;
                font-size:16px;
                display:inline-block;
                ">

                Verify Email

            </a>

        </div>

        <p style="color:#666;font-size:14px;">
            This verification link will expire in 24 hours.
        </p>

        <hr>

        <p style="color:#888;font-size:13px;">
            If you didn't create this account, simply ignore this email.
        </p>

        <p style="font-size:13px;color:#999;text-align:center;">
            © Rentify
        </p>

    </div>
    `;

    await sendEmail(
        user.email,
        "Verify your Rentify account",
        html
    );

};

module.exports = sendVerificationEmail;