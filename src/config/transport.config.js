import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.RECOVER_EMAIL_USERNAME,
    pass: process.env.RECOVER_EMAIL_PASSWORD,
  },
});

export const recoverEmail = process.env.RECOVER_EMAIL_USERNAME;
