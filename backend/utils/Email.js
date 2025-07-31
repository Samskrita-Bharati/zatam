const { text } = require("express");
const nodeMailer = require("nodemailer");

const sendEmail = async (option) => {
  // create a transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.TEST_EMAIL_HOST,
    port: process.env.TEST_EMAIL_PORT,
    auth: {
      user: process.env.TEST_EMAIL_ADDRESS,
      pass: process.env.TEST_EMAIL_PASSWORD,
    },
  });
  // Define email options
  const emailOptions = {
    from: "Zatam support<support@zatam.com>",
    to: option.emailAddress,
    subjet: option.subject,
    text: option.message,
  };

 await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
