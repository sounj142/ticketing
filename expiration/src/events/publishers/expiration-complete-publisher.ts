import {
  Publisher,
  Subjects,
  ExpirationCompleteEventDefinition,
} from '@hoangrepo/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEventDefinition> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
