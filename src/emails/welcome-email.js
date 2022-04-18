"use strict";
const nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const path = require("path");
const configureTransporter = require("./configureTransporter");

const welcomeMail = async (email, name, token) => {
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
  console.log('token from mail sender');
  console.log(token);
  let info = await transporter.sendMail({
    from: 'Awad', // sender address
    to: email, // list of receivers
    subject: "Welcome to Market Manager", // Subject line
    template: "mail",
    context: {
      title: "Market Manager",
      email,
      name,
      token,
      baseUrl: process.env.BASE_URL
    },
  });
  console.log("Message sent: %s", info.messageId);
  
}

module.exports = {welcomeMail};