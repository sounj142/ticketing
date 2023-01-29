import Ticket from '../../../models/ticket';
import { natsInfo } from '../../../utils/nats-client';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { ticketCreateEventProcess } from './ticket-created-listener.test';

it('in happy case returns true and update ticket to db', async () => {
  const { event } = await ticketCreateEventProcess();

  const updateEvent = {
    ...event,
    version: event.version + 1,
    price: event.price * 2,
    ticket: event.title + ' new',
  };

  const result = await new TicketUpdatedListener(natsInfo.client).onMessage(
    updateEvent
  );

  expect(result).toEqual(true);

  const ticket = await Ticket.findById(updateEvent.id);

  expect(ticket?.title).toEqual(updateEvent.title);
  expect(ticket?.price).toEqual(updateEvent.price);
  expect(ticket?.userId).toEqual(updateEvent.userId);
  expect(ticket?.__v).toEqual(updateEvent.version);
});

it('in wrong version case returns true and not change ticket on db', async () => {
  const { event } = await ticketCreateEventProcess();

  const updateEvent = {
    ...event,
    version: event.version + 2,
    price: event.price * 2,
    ticket: event.title + ' new',
  };

  const result = await new TicketUpdatedListener(natsInfo.client).onMessage(
    updateEvent
  );

  expect(result).toEqual(false);

  const ticket = await Ticket.findById(event.id);

  expect(ticket?.title).toEqual(event.title);
  expect(ticket?.price).toEqual(event.price);
  expect(ticket?.userId).toEqual(event.userId);
  expect(ticket?.__v).toEqual(event.version);
});
