import {
  Publisher,
  Subjects,
  OrderCreatedEventDefinition,
} from '@hoangrepo/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEventDefinition> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
