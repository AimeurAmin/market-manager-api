"use strict";
const nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const path = require("path");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "t.w.o.d.e.v.s.2@gmail.com", // generated ethereal user
      pass: "strongStuff%49?!!", // generated ethereal password
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./src/emails/views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./src/emails/views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));

  let info = await transporter.sendMail({
    from: '"Amin Foo 👻" <t.w.o.d.e.v.s.2@gmail.com>', // sender address
    to: "m.amin.aimeur@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    template: "mail",
    context: {
      title: "Market Manager",
      text: "Lorem ipsum dolor sit amet, consectetur...",
    },
    // text: "Hello world?", // plain text body
    // html: `template will go here`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
