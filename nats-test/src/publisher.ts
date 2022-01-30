import { natsWrapper } from '@hoangrepo/common';
import cuid from 'cuid';
import prompt from 'prompt';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
prompt.start();

natsWrapper
  .connect('ticketing', cuid(), 'http://localhost:4222')
  .then(processAfterConnected);

natsWrapper.configGracefulShutdown(() => {
  process.exit();
});

function onErr(err: any) {
  console.log(err);
  return 1;
}

function processAfterConnected() {
  const publisher = new TicketCreatedPublisher(natsWrapper.client);

  promptAndPublish();

  function promptAndPublish() {
    prompt.get(['title'], function (err, result) {
      if (err) {
        return onErr(err);
      }

      if (!result.title) return;

      publisher
        .publish({
          id: 'aaaa',
          title: result.title as string,
          price: Math.random() * 1000,
          userId: 'asasds',
          version: 1,
        })
        .then(() => {
          console.log('event published!');
        });

      setTimeout(() => {
        promptAndPublish();
      });
    });
  }
}
