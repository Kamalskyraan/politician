import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  emailContactUsTemplate,
  emailOtpTemplate,
} from "../utils/email.template.js";

dotenv.config();

// const configOptions = {
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   secure: false, // true for 465, false for 587
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// };
const configOptions = {
  host: `mail.skyraantech.com`,
  port: 465,
  secure: true,
  auth: {
    user: `political@skyraantech.com`,
    pass: `mRmSm*^5a9AIleR6`,
  },
};
export const transporter = nodemailer.createTransport(configOptions);

export const sendMail = async (email, otp) => {
  try {
    const mailContent = await emailOtpTemplate(otp);
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: `${email}`,
      subject: "OTP Verification",
      html: mailContent,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("mail error:", error);
  }
};

export const sendContactUsMail = async (email, comments) => {
  try {
    const mailContent = await emailContactUsTemplate(comments);
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: `${email}`,
      subject: "OTP Verification",
      html: mailContent,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("mail error:", error);
  }
};
