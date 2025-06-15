import nodemailer from 'nodemailer';

type MailType = (email: string, subject: string, message: string) => any;

// async await not allowed in global scope, must be a wrapper
const sendMail: MailType = async function (email, subject, message) {
  // create resuable transporter object using the default SMTP server
  let transporter = nodemailer.createTransport({
    //@ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465 false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: process.env.SMTP_FROM_MAIL, // sender address
    to: email, // user email
    subject: subject, // subject line
    html: message, // html body
  });
};

export default sendMail;
