import IMessageBroker from '../../application/providers/messageBroker';
import {
  PublishMessageParams,
  MessageSubscriptionParams,
  MessageHandler,
} from '../../domain/dtos/messageBroker';
import { Kafka, Consumer, Producer, Partitioners } from 'kafkajs';
import { kafkaConfig } from '../config/kafka.conf';
import logger from '../../utils/logger';

export default class MessageBroker implements IMessageBroker {
  private kafkaClient: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafkaClient = new Kafka({ ...kafkaConfig });
    this.producer = this.kafkaClient.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    this.consumer = this.kafkaClient.consumer({
      groupId: 'products-service-group',
    });
  }

  public async publish(params: PublishMessageParams): Promise<void> {
    try {
      // Connect producer
      await this.producer.connect();

      // Publish message to topic
      await this.producer.send(params);
    } catch (err) {
      // handle retry logic.
      // log error to log system
      logger.error((err as Error).message, err);
    } finally {
      // Disconnect producer
      await this.producer.disconnect();
    }
  }

  public async subscribe(
    params: MessageSubscriptionParams,
    callback: MessageHandler
  ): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe(params);
      await this.consumer.run({
        eachMessage: callback,
      });
    } catch (err) {
      // Handle retry logic
      // Log error to log sytem
      logger.error((err as Error).message, err);
    }
  }
}
