import { natsWrapper, applyLogLevel } from '@hoangorg/common';
import cuid from 'cuid';
import { TicketCreatedListener } from './events/ticket-created-listener';

applyLogLevel('debug');

natsWrapper.connect('ticketing', cuid(), 'http://localhost:4222').then(() => {
  new TicketCreatedListener(natsWrapper.client).listen();
});
