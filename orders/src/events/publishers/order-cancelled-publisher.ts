import {
  Publisher,
  Subjects,
  OrderCancelledEventDefinition,
} from '@hoangorg/common';
import { natsInfo } from '../../utils/nats-client';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEventDefinition> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

let _orderCancelledPublisher: OrderCancelledPublisher | undefined = undefined;
export const getOrderCancelledPublisher = () =>
  _orderCancelledPublisher ||
  (_orderCancelledPublisher = new OrderCancelledPublisher(natsInfo.client));
