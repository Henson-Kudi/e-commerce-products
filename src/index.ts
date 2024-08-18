// import messageBroker from './infrastructure/providers/messageBroker';
import startExpressServer from './presentation/express';
// import kafkaMessageController from './presentation/http/controllers/kafka-message-controller';
// import { productCreated } from './utils/kafkaTopics.json'

export default async function startServer() {
  startExpressServer();
  // Initialise connection to message broker

  // Subscribe to kafka events
  // messageBroker.subscribe([], kafkaMessageController)
}
