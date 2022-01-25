
import { natsWrapper } from '@hoangrepo/common';
import cuid from 'cuid';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
natsWrapper.connect('ticketing', cuid(), 'http://localhost:4222').then(() => {
  new TicketCreatedListener(natsWrapper.client).listen();
});

natsWrapper.configGracefulShutdown(() => {
  process.exit();
});
