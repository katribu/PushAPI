const nodemailer = require('nodemailer');



function mailFunction( email, subject, message) {

// Creating an email sending function
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'rememberall23@hotmail.com',
      pass: 'Rememberall24'
    }
  });
  
  // Setting the mailoptions
  var mailOptions = {
    from: 'rememberall23@hotmail.com',
    to: `${email}`,
    subject: `${subject}`,
    text: `${message}`
  };
  
  // Function for sending the mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}; 

module.exports = {
    mailFunction
}