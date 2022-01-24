
import { natsWrapper } from '@hoangrepo/common';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
natsWrapper.connect('ticketing', 'http://localhost:4222').then(() => {
  new TicketCreatedListener().listen();
});

natsWrapper.configGracefulShutdown(() => {
  process.exit();
});
