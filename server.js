const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Sending mails
sgMail.setApiKey(process.env.API_KEY);
app.post('/schedule-appointment', (req, res) => {
  const mailParams = {
    to: process.env.TO_MAIL, // Receiving email address
    from: process.env.FROM_MAIL, // Verified sender email address
    subject: `New Appointment from ${req.body.name}`,
    text: `You have a new appointment request:\n\n Name: ${req.body.name}
    \n Service Name: ${req.body.serviceName}
    \n Date: ${req.body.date}
    \n Time: ${req.body.time}
    \n Mobile: ${req.body.mob}
    \n Email: ${req.body.mail}`,
  };
  sgMail
    .send(mailParams)
    .then(() => {
      res.status(200).send(`Appointment request has been sent successfully, We will keep you update further!`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Failed to send appointment, Please try again after sometiems or contact ${process.env.CONTACT_MOB}`);
    });
});

const PORT = process.env.PORT || 3000;

// Handles the routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});