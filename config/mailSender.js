const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Kushank",
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error) {
    console.log("Mail Error:", error);
    throw error;
  }
};

module.exports = mailSender;
