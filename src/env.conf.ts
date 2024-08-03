// Inject all your environment variables here
/* eslint-disable no-process-env */
export default {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  KafkaClientId: process.env.KAFKA_CLIENT_ID || 'products-service',
  KafkaBrokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
};
