import nats from 'node-nats-streaming';
import { Subjects } from '@hoangorg/common';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS.');

  const data = JSON.stringify({
    id: '123',
    title: 'Hoang 1111',
    price: Math.random() * 1000,
  });

  stan.publish(Subjects.TicketCreated, data, () => {
    console.log('Event published');
  });
});

stan.on('close', () => {
  console.log('NATS connection closed!');
  process.exit();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

// import { natsWrapper } from '@hoangorg/common';
// import cuid from 'cuid';
// import prompt from 'prompt';
// import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// console.clear();
// prompt.start();

// natsWrapper
//   .connect('ticketing', cuid(), 'http://localhost:4222')
//   .then(processAfterConnected);

// natsWrapper.configGracefulShutdown(() => {
//   process.exit();
// });

// function onErr(err: any) {
//   console.log(err);
//   return 1;
// }

// function processAfterConnected() {
//   const publisher = new TicketCreatedPublisher(natsWrapper.client);

//   promptAndPublish();

//   function promptAndPublish() {
//     prompt.get(['title'], function (err, result) {
//       if (err) {
//         return onErr(err);
//       }

//       if (!result.title) return;

//       publisher
//         .publish({
//           id: 'aaaa',
//           title: result.title as string,
//           price: Math.random() * 1000,
//           userId: 'asasds',
//           version: 1,
//         })
//         .then(() => {
//           console.log('event published!');
//         });

//       setTimeout(() => {
//         promptAndPublish();
//       });
//     });
//   }
// }
