const fs = require('fs');
const AWS = require('aws-sdk');

const { DEVICE_ENDPOINT, TOPIC } = process.env;

const publish = async ({ message }) => {
  const device = new AWS.IotData({ endpoint: DEVICE_ENDPOINT });

  return device.publish({
    topic: TOPIC,
    payload: JSON.stringify({ message }),
    qos: 0,
  }).promise();
}

module.exports.get = async (event) => {
  const data = event.queryStringParameters || {};

  if (data.message) {
    await publish(data);
  }

  const html = fs.readFileSync(process.cwd() + '/views/app.html', 'utf8');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };
};
