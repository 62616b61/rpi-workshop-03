const { mqtt, auth, http, io, iot } = require('aws-crt');
const { TextDecoder } = require('util');

const CONFIG = {
	endpoint: 'a24oab4599p0a-ats.iot.us-east-1.amazonaws.com',
	key: 'keys/rpi-workshop-03-device-00.private.key',
	cert: 'keys/rpi-workshop-03-device-00.cert.pem',
	ca_file: 'keys/root-CA.crt',
	client_id: 'sdk-nodejs-v2',
	topic: 'topic_1',
	count: 10,
	signing_region: 'us-east-1',
	message: 'kek',
	verbosity: 'none'
}

async function execute_session(connection, CONFIG) {
	return new Promise(async (resolve, reject) => {
		try {
			const decoder = new TextDecoder('utf8');
			const on_publish = async (topic, payload) => {
				const json = decoder.decode(payload);
				console.log(`Publish received on topic ${topic}`);
				console.log(json);
				const message = JSON.parse(json);
				if (message.sequence == CONFIG.count) {
					resolve();
				}
			}

			await connection.subscribe(CONFIG.topic, mqtt.QoS.AtLeastOnce, on_publish);

			for (let op_idx = 0; op_idx < CONFIG.count; ++op_idx) {
				const publish = async () => {
					const msg = {
						message: CONFIG.message,
						sequence: op_idx + 1,
					};
					const json = JSON.stringify(msg);
					connection.publish(CONFIG.topic, json, mqtt.QoS.AtLeastOnce);
				}
				setTimeout(publish, op_idx * 1000);
			}
		}
		catch (error) {
			reject(error);
		}
	});
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

	// force node to wait 60 seconds before killing itself, promises do not keep node alive
	const timer = setTimeout(() => {}, 60 * 1000);

	const config = config_builder.build();
	const client = new mqtt.MqttClient(client_bootstrap);
	const connection = client.new_connection(config);

	await connection.connect()
	await execute_session(connection, CONFIG)

	// Allow node to die if the promise above resolved
	clearTimeout(timer);
}
