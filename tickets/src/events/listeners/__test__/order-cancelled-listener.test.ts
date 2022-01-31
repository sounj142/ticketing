import {
  getUtcNow,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@hoangrepo/common';
import { TicketAttrs, TicketModel } from '../../../models/ticket';
import { natsInfo } from '../../../nats-info';
import { OrderCancelledListener } from '../order-cancelled-listener';

it('in happy case, returns true and clear orderId of ticket in db', async () => {
  const ticket = new TicketModel<TicketAttrs>({
    title: 'test ticket',
    price: 100,
    userId: '61ea90014a0a5e110631163b',
  });

  await ticket.save();

  ticket.orderId = '61f12948e67a2571aacee969';
  await ticket.save();

  const event: OrderCancelledEvent = {
    id: ticket.orderId,
    status: OrderStatus.Cancelled,
    userId: '61ea90014a0a5e110631163b',
    createdAt: getUtcNow(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
    },
    version: 1,
  };

  const result = await new OrderCancelledListener(natsInfo.client).onMessage(
    event
  );

  expect(result).toEqual(true);

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);
  const params = (natsInfo.client.publish as jest.Mock).mock.calls[0];
  expect(params[0]).toEqual(Subjects.TicketUpdated);
  const eventData = JSON.parse(params[1]);
  expect(eventData.id).toEqual(ticket.id);
  expect(eventData.orderId).toBeUndefined();

  const confirmTicket = await TicketModel.findById(event.ticket.id);

  expect(confirmTicket?.orderId).toBeUndefined();
});

it('in ticket id does not exist, throw an Error', async () => {
  const event: OrderCancelledEvent = {
    id: '61f12948e67a2571aacee969',
    status: OrderStatus.Cancelled,
    userId: '61ea90014a0a5e110631163b',
    createdAt: getUtcNow(),
    ticket: {
      id: '61f367fd3bbf580d5a10da24',
      price: 10,
      title: 'test ticket',
    },
    version: 1,
  };

  try {
    await new OrderCancelledListener(natsInfo.client).onMessage(event);
  } catch (error) {
    expect(error).toBeDefined();
    return;
  }

  throw new Error('Test failed!');
});
