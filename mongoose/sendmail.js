var nodemailer = require('nodemailer');
function sendMail(data){
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'avimanepatil@gmail.com',
    pass: 'avi@4630'
  }
});

var mailOptions = {
  from: 'avimanepatil@gmail.com',
  to: data.to,
  subject: 'Sending Email using Node.js',
  text: data.msg
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
module.exports = {sendMail};

