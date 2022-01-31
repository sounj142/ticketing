import { TicketAttrs, TicketModel } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket
  const ticket = new TicketModel<TicketAttrs>({
    title: 'concert',
    price: 5,
    userId: '232',
  });

  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await TicketModel.findById(ticket.id);
  const secondInstance = await TicketModel.findById(ticket.id);

  // make two seperate changes to the tickets we fetched
  firstInstance!.price = 10;
  secondInstance!.price = 15;

  // save the first fetched ticket
  await firstInstance?.save();

  // save the second fetch ticket and expect an error

  try {
    await secondInstance?.save();
  } catch (error) {
    expect(error).toBeDefined();
    return;
  }
  throw new Error('Test failed!');
});

it('implements the version number on multiple saves', async () => {
  // create an instance of a ticket
  const ticket = new TicketModel<TicketAttrs>({
    title: 'concert',
    price: 5,
    userId: '232',
  });

  // save the ticket to the database
  await ticket.save();
  expect(ticket.__v).toEqual(0);

  ticket.price = 6;
  await ticket.save();
  expect(ticket.__v).toEqual(1);

  ticket.price = 7;
  await ticket.save();
  expect(ticket.__v).toEqual(2);
});
