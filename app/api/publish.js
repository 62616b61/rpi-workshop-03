const AWS = require('aws-sdk');

const { DEVICE_ENDPOINT, TOPIC } = process.env;

const device = new AWS.IotData({ endpoint: DEVICE_ENDPOINT });

module.exports.post = async (event) => {
  const body = JSON.parse(event.body)

  await device.publish({
    topic: TOPIC,
    payload: JSON.stringify({ message: body.message }),
    qos: 0,
  }).promise();

  return {
    statusCode: 200,
    body: 'ok',
  };
};
