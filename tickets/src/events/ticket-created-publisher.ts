import {
  Publisher,
  Subjects,
  TicketCreatedEventDefinition,
} from '@hoangrepo/common';
import { NatsConfig } from './nat-config';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventDefinition> {
  constructor() {
    super(NatsConfig.natsClient!, Subjects.TicketCreated);
  }
}
