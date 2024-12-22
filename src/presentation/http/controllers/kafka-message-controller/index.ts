import { Message } from 'node-rdkafka';
import logger from '../../../../utils/logger';
import { subscriptions } from '../../../../utils/kafkaTopics.json';
import { KafkaMessageControllerHandler } from '../../../../utils/types/others';
import discountCreatedHandler from './handlers/discounntCreatedEvent';

const handlers: {
  [key: string]: KafkaMessageControllerHandler<any>;
} = {
  [subscriptions.discountCreated]: discountCreatedHandler,
};

export default async function kafkaMessageController(
  message: Message
): Promise<void> {
  try {
    const messageValue = message?.value?.toString();

    if (!messageValue) {
      return;
    }

    const jsonValue = JSON.parse(messageValue);

    const handler = handlers[message.topic];

    if (!handler) {
      logger.warn(`No handler found for topic ${message.topic}`);
      return;
    }

    await handler(jsonValue);
  } catch (err) {
    logger.error((err as Error).message, err);
  }
}
