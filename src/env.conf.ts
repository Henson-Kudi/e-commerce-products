// Inject all your environment variables here
/* eslint-disable no-process-env */
import 'dotenv/config'

export default {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  KafkaClientId: process.env.KAFKA_CLIENT_ID || 'products-service',
  KafkaBrokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
  baseDir: process.cwd(),
  kafka: {
    url: process.env.KAFKA_URL,
    host: process.env.KAFKA_HOST,
    port: process.env.KAFKA_PORT,
    caCertPath: 'certs/ca.'
  }
};
