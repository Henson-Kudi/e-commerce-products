import {
  MessageHandler,
  MessageSubscriptionParams,
  PublishMessageParams,
} from '../../domain/dtos/messageBroker';

export default interface IMessageBroker {
  publish(params: PublishMessageParams): Promise<void>;
  subscribe(
    params: MessageSubscriptionParams,
    callback: MessageHandler
  ): Promise<void>;
}
