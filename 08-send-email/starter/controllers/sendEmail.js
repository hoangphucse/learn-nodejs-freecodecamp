const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const sendEmailEthereal = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'chance.crooks73@ethereal.email', // generated ethereal user
      pass: 'CydUSKRe4jKdeevX2H', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"phuchero', // sender address
    to: 'skysharkno2@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  });

  res.status(200).json({ info });
};

const sendEmailWithSendGrid = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'lvhhiep@tma.com.vn', // Change to your recipient
    from: 'skysharkno2@gmail.com', // Change to your verified sender
    subject: 'Một nghìn một miếng cu đơ 2 nghìn 2 miếng cu đơ 1 nghìn',
    text: 'Quái vật nodeJS thân chào',
    html: '<strong>Quái vật nodeJS thân chào</strong>',
  };
  const info = await sgMail.send(msg);
  res.status(200).json({ info });
};

module.exports = sendEmailWithSendGrid;
