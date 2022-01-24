import { connectToNats } from '@hoangrepo/common';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
connectToNats('ticketing', 'http://localhost:4222', (client) => {
  new TicketCreatedListener(client).listen();
});
