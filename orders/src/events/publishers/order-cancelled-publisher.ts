import {
  Publisher,
  Subjects,
  OrderCancelledEventDefinition,
} from '@hoangrepo/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEventDefinition> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
