const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContenet) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        const mailOptions = {
            from: `"Job Portal" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContenet,
        };
        await transporter.sendMail(mailOptions); // ✅ Correct method
        console.log("✅ Email sent to:", to);

    } catch (error) {
        console.log("❌Error from send email", error.message);

    }
}

module.exports = sendEmail