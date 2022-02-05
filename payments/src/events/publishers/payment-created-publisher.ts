import {
  Publisher,
  Subjects,
  PaymentCreatedEventDefinition,
} from '@hoangrepo/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEventDefinition> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
