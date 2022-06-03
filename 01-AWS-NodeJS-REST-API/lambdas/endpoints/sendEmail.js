const Responses = require('../common/API_Responses');
const AWS = require('aws-sdk');

const SES = new AWS.SES();

exports.handler = async (event) => {
  console.log('event', event);

  const { to, from, subject, text } = JSON.parse(event.body);

  if (!to || !from || !subject || !text) {
    return Responses._400({ message: 'Missing parameters in request' });
  }

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: { Data: text },
      },
      Subject: { Data: subject },
    },
    Source: from,
  };

  try {
    await SES.sendEmail(params).promise();
    return Responses._200();
  } catch (error) {
    console.log('Error sending email', error);
    return Responses._400({ message: 'Failed to send the email' });
  }
};
