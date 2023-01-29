import Ticket from '../../../models/ticket';
import { natsInfo } from '../../../utils/nats-client';
import { TicketCreatedListener } from '../ticket-created-listener';

export async function ticketCreateEventProcess() {
  const event = {
    id: '61f12948e67a2571aacee969',
    title: 'ticket test',
    price: 5,
    userId: '61ea90014a0a5e110631163b',
    version: 0,
  };
  const result = await new TicketCreatedListener(natsInfo.client).onMessage(
    event
  );

  return { event, result };
}

it('returns true and write a new ticket to db', async () => {
  const { event, result } = await ticketCreateEventProcess();

  expect(result).toEqual(true);

  const ticket = await Ticket.findById(event.id);

  expect(ticket?.title).toEqual(event.title);
  expect(ticket?.price).toEqual(event.price);
  expect(ticket?.userId).toEqual(event.userId);
  expect(ticket?.__v).toEqual(event.version);
});
