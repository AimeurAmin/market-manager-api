"use strict";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import configureTransporter from "./configureTransporter.js";

const resetPasswordMail = async (email, name, token) => {
  let transporter = configureTransporter()


  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      // partialsDir: path.resolve("./src/emails/views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./src/emails/views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));
  let info = await transporter.sendMail({
    from: 'Awad', // sender address
    to: email, // list of receivers
    subject: "Reset My Password", // Subject line
    template: "resetPasswordMail",
    context: {
      title: "Market Manager",
      email,
      name,
      token
    },
  });
  console.log("Message sent: %s", info.messageId);
  
}

export default resetPasswordMail;