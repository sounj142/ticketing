import {
  Publisher,
  Subjects,
  TicketCreatedEventDefinition,
} from '@hoangorg/common';
import { natsInfo } from '../../utils/nats-client';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventDefinition> {
  readonly subject = Subjects.TicketCreated;
}

let _ticketCreatedPublisher: TicketCreatedPublisher | undefined = undefined;
export const getTicketCreatedPublisher = () =>
  _ticketCreatedPublisher ||
  (_ticketCreatedPublisher = new TicketCreatedPublisher(natsInfo.client));

