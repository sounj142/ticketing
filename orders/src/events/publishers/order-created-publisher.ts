import {
  Publisher,
  Subjects,
  OrderCreatedEventDefinition,
} from '@hoangorg/common';
import { natsInfo } from '../../utils/nats-client';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEventDefinition> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

let _orderCreatedPublisher: OrderCreatedPublisher | undefined = undefined;
export const getOrderCreatedPublisher = () =>
  _orderCreatedPublisher ||
  (_orderCreatedPublisher = new OrderCreatedPublisher(natsInfo.client));
