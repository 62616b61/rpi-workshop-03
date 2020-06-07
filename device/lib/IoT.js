const { mqtt, io, iot } = require('aws-crt');
const { TextDecoder } = require('util');

const { events, actions } = require('../events');

const decoder = new TextDecoder('utf8');

const CONFIG = {
  endpoint: 'a24oab4599p0a-ats.iot.us-east-1.amazonaws.com',
  key: 'keys/rpi-workshop-03-device-00.private.key',
  cert: 'keys/rpi-workshop-03-device-00.cert.pem',
  client_id: 'sdk-nodejs-v2',
  topic: 'topic_1',
  verbosity: 'none',
}

class IoT {
  constructor () {
    this.logging();
    this.connect();
  }

  logging () {
    if (CONFIG.verbosity != 'none') {
      const level = parseInt(io.LogLevel[CONFIG.verbosity.toUpperCase()]);
      io.enable_logging(level);
    }
  }

  async connect () {
    const client_bootstrap = new io.ClientBootstrap();
    const config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(CONFIG.cert, CONFIG.key);

    config_builder.with_clean_session(false);
    config_builder.with_client_id(CONFIG.client_id);
    config_builder.with_endpoint(CONFIG.endpoint);

    // Keep node running forever
    setInterval(() => {}, 1 << 30);

    const config = config_builder.build();
    const client = new mqtt.MqttClient(client_bootstrap);
    const connection = client.new_connection(config);

    await connection.connect();
    await this.subscribe(connection);
  }

  async subscribe (connection) {
    await connection.subscribe(CONFIG.topic, mqtt.QoS.AtLeastOnce, (topic, payload) => {
      try {
        const json = decoder.decode(payload);
        const message = JSON.parse(json);

        if (message.message) {
          events.emit(actions.IOT_MESSAGE_RECEIVED, message.message);
        }
      } catch(_) {}
    });
  }
}

module.exports = IoT;
