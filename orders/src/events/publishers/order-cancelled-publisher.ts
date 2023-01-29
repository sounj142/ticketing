import {
  Publisher,
  Subjects,
  OrderCancelledEventDefinition,
} from '@hoangorg/common';
import { natsInfo } from '../../utils/nats-client';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEventDefinition> {
  readonly subject = Subjects.OrderCancelled;
}

let _orderCancelledPublisher: OrderCancelledPublisher | undefined = undefined;
export const getOrderCancelledPublisher = () =>
  _orderCancelledPublisher ||
  (_orderCancelledPublisher = new OrderCancelledPublisher(natsInfo.client));
