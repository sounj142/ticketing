import {
  Publisher,
  Subjects,
  TicketUpdatedEventDefinition,
} from '@hoangorg/common';
import { natsInfo } from '../../utils/nats-client';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventDefinition> {
  readonly subject = Subjects.TicketUpdated;
}

let _ticketUpdatedPublisher: TicketUpdatedPublisher | undefined = undefined;
export const getTicketUpdatedPublisher = () =>
  _ticketUpdatedPublisher ||
  (_ticketUpdatedPublisher = new TicketUpdatedPublisher(natsInfo.client));
