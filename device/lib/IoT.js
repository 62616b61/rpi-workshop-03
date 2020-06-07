const { mqtt, io, iot } = require('aws-crt');
const { TextDecoder } = require('util');

const CONFIG = {
  endpoint: 'a24oab4599p0a-ats.iot.us-east-1.amazonaws.com',
  key: 'keys/rpi-workshop-03-device-00.private.key',
  cert: 'keys/rpi-workshop-03-device-00.cert.pem',
  ca_file: 'keys/root-CA.crt',
  client_id: 'sdk-nodejs-v2',
  topic: 'topic_1',
  verbosity: 'none'
}

async function subscribe(connection) {
  const decoder = new TextDecoder('utf8');
  const on_publish = async (topic, payload) => {
    const json = decoder.decode(payload);
    console.log(`Publish received on topic ${topic}`);
    console.log(json);
  }

  await connection.subscribe(CONFIG.topic, mqtt.QoS.AtLeastOnce, on_publish);
}

module.exports = async function main() {
  if (CONFIG.verbosity != 'none') {
    const level = parseInt(io.LogLevel[CONFIG.verbosity.toUpperCase()]);
    io.enable_logging(level);
  }

  const client_bootstrap = new io.ClientBootstrap();

  const config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(CONFIG.cert, CONFIG.key);

  if (CONFIG.ca_file != null) {
    config_builder.with_certificate_authority_from_path(undefined, CONFIG.ca_file);
  }

  config_builder.with_clean_session(false);
  config_builder.with_client_id(CONFIG.client_id);
  config_builder.with_endpoint(CONFIG.endpoint);

  // Keep node running forever
  setInterval(() => {}, 1 << 30);

  const config = config_builder.build();
  const client = new mqtt.MqttClient(client_bootstrap);
  const connection = client.new_connection(config);

  await connection.connect()
  await subscribe(connection)
}
