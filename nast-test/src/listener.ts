import { natsWrapper } from '@hoangorg/common';
import cuid from 'cuid';
import { TicketCreatedListener } from './events/ticket-created-listener';

natsWrapper.connect('ticketing', cuid(), 'http://localhost:4222').then(() => {
  new TicketCreatedListener(natsWrapper.client).listen();
});

natsWrapper.configGracefulShutdown(() => {
  process.exit();
});

// import nats, { Message } from 'node-nats-streaming';
// import cuid from 'cuid';
// import { Subjects } from '@hoangorg/common';

// const stan = nats.connect('ticketing', cuid(), {
//   url: 'http://localhost:4222',
// });

// stan.on('connect', () => {
//   console.log('Listener connected to NATS.');

//   const options = stan
//     .subscriptionOptions()
//     .setManualAckMode(true)
//     .setDeliverAllAvailable()
//     .setDurableName('my-order-service');
//   const subscription = stan.subscribe(
//     Subjects.TicketCreated,
//     'order-service-queue-group',
//     options
//   );

//   subscription.on('message', (msg: Message) => {
//     const data = msg.getData();
//     if (typeof data === 'string')
//       console.log(`Received message #${msg.getSequence()}`, JSON.parse(data));
//     msg.ack();
//   });
// });

// stan.on('close', () => {
//   console.log('NATS connection closed!');
//   process.exit();
// });

// process.on('SIGINT', () => stan.close());
// process.on('SIGTERM', () => stan.close());
